import { useEffect, useRef, useState } from 'react';

export function GoogleMap({ apiKey }: { apiKey: string }) {
  const [showMap, setShowMap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before it enters viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (showMap) {
    return (
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Spice+Grill+%26+Bar,+Ash+Fork,+AZ`}
        title="Spice Grill & Bar location on Google Maps - 33 Lewis Ave, Ash Fork, AZ 86320"
        style={{ border: 0, width: '100%', height: '100%' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="group relative flex h-full w-full cursor-pointer items-center justify-center bg-zinc-100 dark:bg-zinc-800"
      onClick={() => setShowMap(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setShowMap(true);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Load Google Maps"
    >
      <img
        src="/location-preview.webp"
        alt="Map Preview"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-75"
      />
      <div className="relative z-10 animate-pulse text-center">
        <p className="mb-4 font-medium text-zinc-600 dark:text-zinc-300">Loading Map...</p>
      </div>
    </div>
  );
}
