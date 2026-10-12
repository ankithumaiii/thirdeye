import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ScenarioCardMedia from '../components/ScenarioCardMedia.jsx';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ScenarioCardMedia', () => {
  it('shows a Gemini-selected thumbnail and loads its video on request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        videos: [{
          id: 'abcdefghijk',
          title: 'Safe bystander intervention',
          embedUrl: 'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0'
        }]
      })
    }));

    render(<ScenarioCardMedia scenario={{ id: 'metro', title: 'Late Night Metro Car' }} />);

    const playButton = await screen.findByRole('button', {
      name: 'Play video preview for Late Night Metro Car'
    });
    expect(screen.getByAltText('Video thumbnail: Safe bystander intervention'))
      .toHaveAttribute('src', 'https://img.youtube.com/vi/abcdefghijk/hqdefault.jpg');

    fireEvent.click(playButton);
    expect(screen.getByTitle('Safe bystander intervention'))
      .toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0');
  });

  it('shows a status when Gemini video search fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ message: 'Gemini video search is temporarily unavailable.' })
    }));

    render(<ScenarioCardMedia scenario={{ id: 'metro', title: 'Late Night Metro Car' }} />);

    expect(await screen.findByRole('status')).toHaveTextContent('Video preview unavailable');
  });
});
