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

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setTriedFallback(false);
  }, [src]);

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
    />
  );
}

