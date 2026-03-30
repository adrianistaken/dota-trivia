'use client';

import { useEffect, useRef, useCallback } from 'react';

// Images that fly across the screen — add more paths here
const PORTRAIT_IMAGES = [
  '/images/portraits/Queen_of_Pain_icon_dota2_gameasset.png',
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Quadratic bezier point
function bezier(t: number, p0: number, p1: number, p2: number) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

interface StarConfig {
  image: string;
  x0: number; y0: number;   // Start position (viewport %)
  cx: number; cy: number;   // Arc control point (viewport %)
  x1: number; y1: number;   // End position (viewport %)
  duration: number;
  size: number;
  glowSize: number;
  glowPulseSpeed: number;
  rotationStart: number;
  rotationEnd: number;
}

function createStarConfig(): StarConfig {
  const edge = Math.floor(Math.random() * 4);
  let x0: number, y0: number, x1: number, y1: number;

  switch (edge) {
    case 0: // left → right
      x0 = randomBetween(-10, -5);
      y0 = randomBetween(5, 95);
      x1 = randomBetween(105, 115);
      y1 = randomBetween(5, 95);
      break;
    case 1: // top → bottom
      x0 = randomBetween(5, 95);
      y0 = randomBetween(-10, -5);
      x1 = randomBetween(5, 95);
      y1 = randomBetween(105, 115);
      break;
    case 2: // right → left
      x0 = randomBetween(105, 115);
      y0 = randomBetween(5, 95);
      x1 = randomBetween(-10, -5);
      y1 = randomBetween(5, 95);
      break;
    default: // bottom → top
      x0 = randomBetween(5, 95);
      y0 = randomBetween(105, 115);
      x1 = randomBetween(5, 95);
      y1 = randomBetween(-10, -5);
  }

  // Arc control point — offset perpendicular to the travel line
  const midX = (x0 + x1) / 2;
  const midY = (y0 + y1) / 2;
  // Random arc intensity: sometimes barely curved, sometimes a big sweep
  // Arc curvature: 0 = straight, higher = more curved. Negative = curve left, positive = curve right
  const arcStrength = randomBetween(-35, 35);
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendicular direction
  const perpX = -dy / len;
  const perpY = dx / len;
  const cx = midX + perpX * arcStrength;
  const cy = midY + perpY * arcStrength;

  return {
    image: PORTRAIT_IMAGES[Math.floor(Math.random() * PORTRAIT_IMAGES.length)],
    x0, y0, cx, cy, x1, y1,
    duration: randomBetween(5, 11),        // Speed: seconds to cross the screen
    size: randomBetween(90, 130),          // Icon size in px
    glowSize: randomBetween(1.2, 1.8),    // Glow radius as multiplier of icon size
    glowPulseSpeed: randomBetween(2, 4),  // Glow pulse cycle in seconds
    rotationStart: randomBetween(-8, 8),  // Gentle spin start angle (degrees)
    rotationEnd: randomBetween(-8, 8),    // Gentle spin end angle (degrees)
  };
}

interface ActiveStar {
  config: StarConfig;
  startTime: number;
  el: HTMLDivElement | null;
}

export default function ShootingStars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<ActiveStar[]>([]);
  const rafRef = useRef<number>(0);

  const spawnStar = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const config = createStarConfig();

    // Build DOM
    const el = document.createElement('div');
    el.className = 'shooting-star-js';
    el.style.width = `${config.size}px`;
    el.style.height = `${config.size}px`;

    // Glow
    const glow = document.createElement('div');
    glow.className = 'ss-glow';
    const glowDim = config.size * config.glowSize;
    glow.style.width = `${glowDim}px`;
    glow.style.height = `${glowDim}px`;
    el.appendChild(glow);


    // Image
    const img = document.createElement('img');
    img.className = 'ss-img';
    img.src = config.image;
    img.alt = '';
    img.style.width = `${config.size}px`;
    img.style.height = `${config.size}px`;
    el.appendChild(img);

    container.appendChild(el);

    starsRef.current.push({
      config,
      startTime: performance.now(),
      el,
    });
  }, []);

  const animate = useCallback((now: number) => {
    const stars = starsRef.current;
    const toRemove: number[] = [];

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const { config, startTime, el } = star;
      if (!el) continue;

      const elapsed = (now - startTime) / 1000;
      const t = Math.min(elapsed / config.duration, 1);

      if (t >= 1) {
        el.remove();
        toRemove.push(i);
        continue;
      }

      // Position along bezier curve
      const x = bezier(t, config.x0, config.cx, config.x1);
      const y = bezier(t, config.y0, config.cy, config.y1);

      // Opacity: fade in fast, sustain, fade out
      let opacity: number;
      if (t < 0.05) opacity = t / 0.05;
      else if (t > 0.85) opacity = (1 - t) / 0.15;
      else opacity = 1;
      opacity *= 0.85; // Max opacity of the icons (0-1)

      // Slight rotation that changes over time
      const rotation = config.rotationStart + (config.rotationEnd - config.rotationStart) * t;

      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.opacity = `${opacity}`;
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

      // Glow pulse
      const glowChild = el.children[0] as HTMLElement;
      const glowPulse = 0.3 + 0.2 * Math.sin(now / (config.glowPulseSpeed * 300));
      glowChild.style.opacity = `${glowPulse}`;
    }

    // Remove finished stars
    for (let i = toRemove.length - 1; i >= 0; i--) {
      stars.splice(toRemove[i], 1);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Spawn initial stars
    const t1 = setTimeout(spawnStar, 300);
    const t2 = setTimeout(spawnStar, 900);

    // Keep spawning
    let spawnTimeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      spawnTimeout = setTimeout(() => {
        spawnStar();
        scheduleNext();
      }, randomBetween(1000, 2800)); // Spawn interval: ms between new stars (lower = more frequent)
    };
    scheduleNext();

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(spawnTimeout);
      cancelAnimationFrame(rafRef.current);
      // Clean up DOM
      starsRef.current.forEach((s) => s.el?.remove());
      starsRef.current = [];
    };
  }, [spawnStar, animate]);

  return <div ref={containerRef} className="shooting-stars-container" />;
}
