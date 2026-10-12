import { ENV } from '../config/env.js';

const CACHE_TTL_MS = 30 * 60 * 1000;
const SEARCH_TIMEOUT_MS = 20000;
const REDIRECT_TIMEOUT_MS = 4000;
const MAX_VIDEOS = 3;
const MAX_GROUNDING_SOURCES = 8;
const videoCache = new Map();
const pendingSearches = new Map();

function createServiceError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function getYoutubeVideoId(uri) {
  let url;
  try {
    url = new URL(uri);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;

  const host = url.hostname.toLowerCase();
  let videoId = null;
  if (host === 'youtu.be' || host === 'www.youtu.be') {
    videoId = url.pathname.split('/').filter(Boolean)[0];
  } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v');
    } else {
      videoId = url.pathname.match(/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})\/?$/)?.[1];
    }
  }

  return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
}

export function extractGroundedYoutubeVideos(groundingChunks = []) {
  const seen = new Set();
  const videos = [];

  for (const chunk of groundingChunks) {
    const source = chunk?.web;
    const videoId = getYoutubeVideoId(source?.uri);
    if (!videoId || seen.has(videoId)) continue;

    seen.add(videoId);
    videos.push({
      id: videoId,
      title: typeof source.title === 'string' && source.title.trim()
        ? source.title.trim()
        : 'Related bystander safety video',
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    });

    if (videos.length === MAX_VIDEOS) break;
  }

  return videos;
}

async function resolveGroundedYoutubeVideos(groundingChunks, responseText) {
  const sources = groundingChunks
    .map((chunk) => chunk?.web)
    .filter((source) => typeof source?.uri === 'string')
    .slice(0, MAX_GROUNDING_SOURCES);

  const resolvedSources = await Promise.all(sources.map(async (source) => {
    const directVideoId = getYoutubeVideoId(source.uri);
    if (directVideoId) return { source, uri: source.uri };

    let sourceUrl;
    try {
      sourceUrl = new URL(source.uri);
    } catch {
      return null;
    }

    if (
      sourceUrl.protocol !== 'https:' ||
      sourceUrl.hostname !== 'vertexaisearch.cloud.google.com' ||
      !sourceUrl.pathname.startsWith('/grounding-api-redirect/')
    ) {
      return null;
    }

    let response;
    try {
      response = await fetch(sourceUrl, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(REDIRECT_TIMEOUT_MS)
      });
    } catch {
      throw createServiceError(
        502,
        'GEMINI_VIDEO_SEARCH_FAILED',
        'Could not validate Google Search video links. Please try again.'
      );
    }

    const location = response.headers.get('location');
    if (!location) return null;

    let destination;
    try {
      destination = new URL(location, sourceUrl);
    } catch {
      return null;
    }

    if (!getYoutubeVideoId(destination.href)) return null;
    return { source, uri: destination.href };
  }));

  const responseTitles = [...responseText.matchAll(/(?:^|\n)\s*(?:\d+[.)]\s*)\*\*([^*]+)\*\*/g)]
    .map((match) => match[1].trim());
  const videos = [];
  const seen = new Set();
  for (const [index, resolved] of resolvedSources.entries()) {
    if (!resolved) continue;
    const videoId = getYoutubeVideoId(resolved.uri);
    if (!videoId || seen.has(videoId)) continue;

    seen.add(videoId);
    const citationIndex = responseText.indexOf(resolved.source.uri);
    const titleIndex = citationIndex < 0
      ? index
      : [...responseText.slice(0, citationIndex).matchAll(/(?:^|\n)\s*(?:\d+[.)]\s*)\*\*([^*]+)\*\*/g)].length - 1;
    const responseTitle = titleIndex >= 0 ? responseTitles[titleIndex] : null;
    const groundedTitle = typeof resolved.source.title === 'string' &&
      resolved.source.title.trim() &&
      !/^youtube\.com$/i.test(resolved.source.title.trim())
      ? resolved.source.title.trim()
      : responseTitle || 'Related bystander safety video';

    videos.push({
      id: videoId,
      title: groundedTitle,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    });

    if (videos.length === MAX_VIDEOS) break;
  }

  return videos;
}

async function searchGeminiVideos(promptText) {
  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(ENV.GEMINI_MODEL)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': ENV.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
        }),
        signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS)
      }
    );
  } catch (error) {
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
    throw createServiceError(
      502,
      'GEMINI_VIDEO_SEARCH_FAILED',
      timedOut
        ? 'Gemini video search timed out. Please try again.'
        : 'Gemini video search is temporarily unavailable.'
    );
  }

  if (!response.ok) {
    throw createServiceError(
      502,
      'GEMINI_VIDEO_SEARCH_FAILED',
      'Gemini could not find related videos. Please try again later.'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw createServiceError(
      502,
      'GEMINI_VIDEO_SEARCH_FAILED',
      'Gemini returned an invalid video search response.'
    );
  }

  const groundingChunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const responseText = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('\n') || '';
  return resolveGroundedYoutubeVideos(groundingChunks || [], responseText);
}

export async function findScenarioVideos(scenario) {
  if (!ENV.GEMINI_API_KEY?.trim()) {
    throw createServiceError(
      503,
      'GEMINI_NOT_CONFIGURED',
      'Related videos require a configured Gemini API key.'
    );
  }

  const cached = videoCache.get(scenario.id);
  if (cached && cached.expiresAt > Date.now()) return cached.videos;

  const pending = pendingSearches.get(scenario.id);
  if (pending) return pending;

  const search = (async () => {
    let videos = await searchGeminiVideos(`Search Google now for up to three public YouTube videos about the 5 Ds of bystander intervention and safe de-escalation in ${scenario.location}.
Choose credible educational videos relevant to this fictional training scenario: ${scenario.title}. ${scenario.environment}.
Do not recommend graphic, sensational, or confrontational content. Return the video titles and links from your search results.`);

    if (!videos.length) {
      videos = await searchGeminiVideos(`Search Google for one to three credible public YouTube videos about the 5 Ds of bystander intervention and safe de-escalation.
The scenario-specific search had no embeddable results, so choose general educational resources that are relevant to ${scenario.title} in ${scenario.location}.
Do not recommend graphic, sensational, or confrontational content. Return links from your search results.`);
    }

    videoCache.set(scenario.id, { videos, expiresAt: Date.now() + CACHE_TTL_MS });
    return videos;
  })();

  pendingSearches.set(scenario.id, search);
  try {
    return await search;
  } finally {
    pendingSearches.delete(scenario.id);
  }
}
