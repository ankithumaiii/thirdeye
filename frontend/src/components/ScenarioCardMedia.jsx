import React, { useEffect, useState } from 'react';
import { LoaderCircle, Play } from 'lucide-react';
import { fetchScenarioVideos } from '../services/api.js';

export default function ScenarioCardMedia({ scenario, badge, height = '160px' }) {
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setVideo(null);
    setIsLoading(true);
    setIsPlaying(false);
    setImageFailed(false);
    setErrorMessage('');

    fetchScenarioVideos(scenario.id, { signal: controller.signal })
      .then((videos) => {
        if (!controller.signal.aborted) setVideo(videos[0] || null);
      })
      .catch((error) => {
        if (!controller.signal.aborted && error.name !== 'AbortError') {
          setErrorMessage(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [scenario.id]);

  const handlePlay = (event) => {
    event.stopPropagation();
    setIsPlaying(true);
  };

  return (
    <div
      className={`netflix-card-thumb scenario-card-media scenario-card-media-${scenario.id}`}
      style={{ height }}
    >
      {video && !imageFailed && !isPlaying && (
        <img
          className="scenario-card-image"
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={`Video thumbnail: ${video.title}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}

      {isPlaying && video ? (
        <iframe
          className="scenario-card-video"
          src={video.embedUrl}
          title={video.title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          {badge && <span className="thumb-tag-badge">{badge}</span>}
          {video ? (
            <button
              type="button"
              className="scenario-card-play"
              onClick={handlePlay}
              aria-label={`Play video preview for ${scenario.title}`}
            >
              <span className="play-circle-icon">
                <Play size={20} fill="currentColor" />
              </span>
            </button>
          ) : (
            <div className="scenario-card-media-status" role="status">
              {isLoading ? (
                <>
                  <LoaderCircle size={15} />
                  <span>Finding a Gemini video</span>
                </>
              ) : (
                <span>{errorMessage ? 'Video preview unavailable' : 'No video preview found'}</span>
              )}
            </div>
          )}
          {video && <span className="scenario-card-source">Gemini pick</span>}
        </>
      )}
    </div>
  );
}
