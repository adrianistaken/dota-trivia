'use client';

import { useState, useEffect } from 'react';

interface AssetImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string | null;
  onError?: () => void;
}

/**
 * AssetImage component with graceful error handling and fallback support
 * 
 * Handles image load failures silently and supports fallback URLs.
 * Never throws errors or breaks the UI.
 */
export default function AssetImage({
  src,
  alt,
  className = '',
  fallbackSrc = null,
  onError,
}: AssetImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Reset state when src changes
  useEffect(() => {
    if (src !== currentSrc) {
      setIsLoaded(false);
      setOpacity(0);
    }
    setCurrentSrc(src);
    setHasError(false);
    setTriedFallback(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    // Fade in after image loads
    setTimeout(() => setOpacity(1), 10);
  };

  const handleError = () => {
    // Try fallback if available and not already tried
    if (fallbackSrc && !triedFallback && currentSrc !== fallbackSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
      return;
    }

    // If we've tried fallback or no fallback exists, hide the image
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  // Don't render anything if no src or error occurred
  if (!currentSrc || hasError) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      style={{ 
        opacity: opacity,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
}

