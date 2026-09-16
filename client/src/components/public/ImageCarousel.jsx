import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Image carousel.
 *
 * Props:
 *  - images: string[]   – array of image URLs
 *  - alt: string        – alt text for the images
 *  - interval: number   – ms between auto-scrolls (default 3000)
 *  - autoplay: boolean  – when true, auto-advance every `interval` ms (default false)
 */
export default function ImageCarousel({ images = [], alt = '', interval = 3000, autoplay = false }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const count = images.length;

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + count) % count);
  }, [count]);

  // auto-scroll
  useEffect(() => {
    if (!autoplay || count <= 1 || paused) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [autoplay, count, paused, next, interval]);

  if (count === 0) return null;

  // single image — no carousel chrome
  if (count === 1) {
    return (
      <div className="carousel">
        <div className="carousel-track">
          <img src={images[0]} alt={alt} loading="lazy" />
        </div>
      </div>
    );
  }

  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(e); };

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-track">
        <img src={images[current]} alt={alt} loading="lazy" />
      </div>

      <button className="carousel-btn carousel-prev" onClick={stop(prev)} aria-label="Previous image">
        &#8249;
      </button>
      <button className="carousel-btn carousel-next" onClick={stop(next)} aria-label="Next image">
        &#8250;
      </button>

      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={stop(() => setCurrent(i))}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
