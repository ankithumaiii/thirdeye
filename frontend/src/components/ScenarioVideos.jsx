import React, { useEffect, useState } from 'react';
import { ExternalLink, LoaderCircle, Video } from 'lucide-react';
import { fetchScenarioVideos } from '../services/api.js';

export default function ScenarioVideos({ scenario }) {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setVideos([]);
    setIsLoading(true);
    setErrorMessage('');

    fetchScenarioVideos(scenario.id, { signal: controller.signal })
      .then((results) => {
        if (!controller.signal.aborted) setVideos(results);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setErrorMessage(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [scenario.id]);

  return (
    <section className="scenario-videos-panel" aria-labelledby="scenario-videos-title">
      <div className="scenario-videos-heading">
        <div className="scenario-videos-heading-copy">
          <span className="scenario-videos-icon"><Video size={17} /></span>
          <div>
            <h2 id="scenario-videos-title">Related videos</h2>
            <p>Public YouTube resources selected with Gemini Search</p>
          </div>
        </div>
        {isLoading && (
          <span className="scenario-videos-loading" role="status">
            <LoaderCircle size={15} />
            Searching
          </span>
        )}
      </div>

      {errorMessage ? (
        <p className="scenario-videos-message" role="status">{errorMessage}</p>
      ) : isLoading ? (
        <p className="scenario-videos-message">Finding safety-focused videos for this scenario…</p>
      ) : videos.length ? (
        <div className="scenario-videos-grid">
          {videos.map((video) => (
            <article className="scenario-video-card" key={video.id}>
              <div className="scenario-video-frame">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="scenario-video-caption">
                <span className="scenario-video-title">{video.title}</span>
                <a href={video.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${video.title} on YouTube`}>
                  <ExternalLink size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="scenario-videos-message">
            No embeddable YouTube videos were found. You can still start the scenario briefing.
          </p>
        )
      )}

      <p className="scenario-videos-disclaimer">
        External videos are for context only. Prioritize personal safety; never attempt an unsafe intervention.
      </p>
    </section>
  );
}
