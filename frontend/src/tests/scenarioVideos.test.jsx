import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScenarioVideos from '../components/ScenarioVideos.jsx';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ScenarioVideos', () => {
  it('embeds returned videos and links to their YouTube pages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        videos: [{
          id: 'abcdefghijk',
          title: 'Bystander intervention basics',
          url: 'https://www.youtube.com/watch?v=abcdefghijk',
          embedUrl: 'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0'
        }]
      })
    }));

    render(<ScenarioVideos scenario={{ id: 'metro' }} />);

    const video = await screen.findByTitle('Bystander intervention basics');
    expect(video).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0');
    expect(screen.getByRole('link', { name: 'Open Bystander intervention basics on YouTube' }))
      .toHaveAttribute('href', 'https://www.youtube.com/watch?v=abcdefghijk');
  });

  it('shows the backend error when grounded video search is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ message: 'Related videos require a configured Gemini API key.' })
    }));

    render(<ScenarioVideos scenario={{ id: 'metro' }} />);

    expect(await screen.findByText('Related videos require a configured Gemini API key.'))
      .toHaveAttribute('role', 'status');
  });
});
