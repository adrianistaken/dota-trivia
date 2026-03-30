'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Quadratic bezier point
function bezier(t: number, p0: number, p1: number, p2: number) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface FlyingImage {
  path: string;
  category: string;
}

// Cycles through all images in shuffled order, never repeating until all have been shown.
// When reshuffling, ensures the last few images from the previous cycle
// don't appear first in the next cycle (prevents near-boundary repeats).
function createImageCycler(images: FlyingImage[]) {
  let queue: FlyingImage[] = [];
  let lastPicked: FlyingImage[] = [];
  const recentBuffer = Math.min(5, Math.floor(images.length / 3));

  return () => {
    if (queue.length === 0) {
      let shuffled = shuffleArray(images);
      if (lastPicked.length > 0) {
        const recentSet = new Set(lastPicked.map(i => i.path));
        const deferred: FlyingImage[] = [];
        const safe: FlyingImage[] = [];
        for (const img of shuffled) {
          if (recentSet.has(img.path)) deferred.push(img);
          else safe.push(img);
        }
        shuffled = [...safe, ...shuffleArray(deferred)];
      }
      queue = shuffled;
      lastPicked = [];
    }
    const picked = queue.pop()!;
    lastPicked.push(picked);
    if (lastPicked.length > recentBuffer) lastPicked.shift();
    return picked;
  };
}

interface StarConfig {
  image: string;
  category: string;
  x0: number; y0: number;
  cx: number; cy: number;
  x1: number; y1: number;
  duration: number;
  size: number;
  glowSize: number;
  glowPulseSpeed: number;
  rotationStart: number;
  rotationEnd: number;
}

function getSizeRange(category: string): [number, number] {
  if (category === 'portraits') return [90, 130];
  return [55, 80]; // items, abilities
}

function createStarConfig(nextImage: () => FlyingImage): StarConfig {
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

  const midX = (x0 + x1) / 2;
  const midY = (y0 + y1) / 2;
  const arcStrength = randomBetween(-35, 35);
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = -dy / len;
  const perpY = dx / len;
  const cx = midX + perpX * arcStrength;
  const cy = midY + perpY * arcStrength;

  const picked = nextImage();
  const [sizeMin, sizeMax] = getSizeRange(picked.category);

  return {
    image: picked.path,
    category: picked.category,
    x0, y0, cx, cy, x1, y1,
    duration: randomBetween(5, 11),
    size: randomBetween(sizeMin, sizeMax),
    glowSize: randomBetween(1.2, 1.8),
    glowPulseSpeed: randomBetween(2, 4),
    rotationStart: randomBetween(-8, 8),
    rotationEnd: randomBetween(-8, 8),
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
  const nextImageRef = useRef<(() => FlyingImage) | null>(null);
  const [ready, setReady] = useState(false);

  // Fetch available images from the API and set up the cycler
  useEffect(() => {
    fetch('/api/flying-images')
      .then(res => res.json())
      .then((images: FlyingImage[]) => {
        if (images.length > 0) {
          nextImageRef.current = createImageCycler(images);
          setReady(true);
        }
      });
  }, []);

  const spawnStar = useCallback(() => {
    const container = containerRef.current;
    const nextImage = nextImageRef.current;
    if (!container || !nextImage) return;

    const config = createStarConfig(nextImage);

    const el = document.createElement('div');
    el.className = 'shooting-star-js';
    el.style.width = `${config.size}px`;
    el.style.height = `${config.size}px`;

    const glow = document.createElement('div');
    glow.className = 'ss-glow';
    const glowDim = config.size * config.glowSize;
    glow.style.width = `${glowDim}px`;
    glow.style.height = `${glowDim}px`;
    el.appendChild(glow);

    const img = document.createElement('img');
    img.className = `ss-img ss-img--${config.category}`;
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

      const x = bezier(t, config.x0, config.cx, config.x1);
      const y = bezier(t, config.y0, config.cy, config.y1);

      let opacity: number;
      if (t < 0.05) opacity = t / 0.05;
      else if (t > 0.85) opacity = (1 - t) / 0.15;
      else opacity = 1;
      opacity *= 0.85;

      const rotation = config.rotationStart + (config.rotationEnd - config.rotationStart) * t;

      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.opacity = `${opacity}`;
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

      const glowChild = el.children[0] as HTMLElement;
      const glowPulse = 0.3 + 0.2 * Math.sin(now / (config.glowPulseSpeed * 300));
      glowChild.style.opacity = `${glowPulse}`;
    }

    for (let i = toRemove.length - 1; i >= 0; i--) {
      stars.splice(toRemove[i], 1);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const t1 = setTimeout(spawnStar, 300);
    const t2 = setTimeout(spawnStar, 900);

    let spawnTimeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      spawnTimeout = setTimeout(() => {
        spawnStar();
        scheduleNext();
      }, randomBetween(1000, 2800));
    };
    scheduleNext();

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(spawnTimeout);
      cancelAnimationFrame(rafRef.current);
      starsRef.current.forEach((s) => s.el?.remove());
      starsRef.current = [];
    };
  }, [ready, spawnStar, animate]);

  return <div ref={containerRef} className="shooting-stars-container" />;
}
