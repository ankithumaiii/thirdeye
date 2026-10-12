import { afterEach, describe, expect, it, vi } from 'vitest';
import { ENV } from '../src/config/env.js';
import { extractGroundedYoutubeVideos, findScenarioVideos } from '../src/services/scenarioVideos.service.js';

const originalApiKey = ENV.GEMINI_API_KEY;

afterEach(() => {
  ENV.GEMINI_API_KEY = originalApiKey;
  vi.unstubAllGlobals();
});

describe('scenario video search', () => {
  it('only returns unique, grounded YouTube video links', () => {
    const videos = extractGroundedYoutubeVideos([
      { web: { uri: 'https://www.youtube.com/watch?v=abcdefghijk', title: 'Bystander safety' } },
      { web: { uri: 'https://example.com/watch?v=lmnopqrstuv', title: 'Not YouTube' } },
      { web: { uri: 'https://youtube.com.evil.test/watch?v=zyxwvutsrqp', title: 'Spoofed host' } },
      { web: { uri: 'https://youtu.be/abcdefghijk', title: 'Duplicate' } },
      { web: { uri: 'https://youtube.com/shorts/lmnopqrstuv', title: 'A short video' } }
    ]);

    expect(videos).toEqual([
      {
        id: 'abcdefghijk',
        title: 'Bystander safety',
        url: 'https://www.youtube.com/watch?v=abcdefghijk',
        embedUrl: 'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0'
      },
      {
        id: 'lmnopqrstuv',
        title: 'A short video',
        url: 'https://www.youtube.com/watch?v=lmnopqrstuv',
        embedUrl: 'https://www.youtube-nocookie.com/embed/lmnopqrstuv?rel=0'
      }
    ]);
  });

  it('uses Gemini Google Search grounding and limits returned videos', async () => {
    ENV.GEMINI_API_KEY = 'test-key';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{
          groundingMetadata: {
            groundingChunks: Array.from({ length: 5 }, (_, index) => ({
              web: {
                uri: `https://www.youtube.com/watch?v=${String(index).padStart(11, 'a')}`,
                title: `Video ${index}`
              }
            }))
          }
        }]
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    const videos = await findScenarioVideos({
      id: 'video-search-test',
      title: 'Transit safety',
      location: 'a public transit station',
      environment: 'a busy public setting'
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toContain(':generateContent');
    expect(request.headers['x-goog-api-key']).toBe('test-key');
    expect(JSON.parse(request.body).tools).toEqual([{ google_search: {} }]);
    expect(videos).toHaveLength(3);
  });

  it('searches for general safety resources when a scenario-specific search has no video results', async () => {
    ENV.GEMINI_API_KEY = 'test-key';
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [{ groundingMetadata: { groundingChunks: [] } }] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{
            groundingMetadata: {
              groundingChunks: [{
                web: {
                  uri: 'https://www.youtube.com/watch?v=abcdefghijk',
                  title: 'Bystander intervention basics'
                }
              }]
            }
          }]
        })
      });
    vi.stubGlobal('fetch', fetchMock);

    const videos = await findScenarioVideos({
      id: 'video-search-fallback-test',
      title: 'Campus corridor safety',
      location: 'a campus library',
      environment: 'a busy public setting'
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).contents[0].parts[0].text)
      .toContain('general educational resources');
    expect(videos[0].id).toBe('abcdefghijk');
  });

  it('validates Google grounding redirects before embedding YouTube videos', async () => {
    ENV.GEMINI_API_KEY = 'test-key';
    const redirectUri = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/test-video';
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: `1. **Bystander Intervention Basics**\n* **Link:** ${redirectUri}`
              }]
            },
            groundingMetadata: {
              groundingChunks: [{ web: { uri: redirectUri, title: 'youtube.com' } }]
            }
          }]
        })
      })
      .mockResolvedValueOnce({
        headers: { get: () => 'https://www.youtube.com/watch?v=abcdefghijk' }
      });
    vi.stubGlobal('fetch', fetchMock);

    const videos = await findScenarioVideos({
      id: 'grounding-redirect-test',
      title: 'Transit safety',
      location: 'a transit car',
      environment: 'a public setting'
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: 'HEAD',
      redirect: 'manual'
    });
    expect(videos).toEqual([{
      id: 'abcdefghijk',
      title: 'Bystander Intervention Basics',
      url: 'https://www.youtube.com/watch?v=abcdefghijk',
      embedUrl: 'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0'
    }]);
  });

  it('reports a clear error when the Gemini API key is missing', async () => {
    ENV.GEMINI_API_KEY = '';

    await expect(findScenarioVideos({ id: 'no-key' })).rejects.toMatchObject({
      status: 503,
      code: 'GEMINI_NOT_CONFIGURED'
    });
  });
});
