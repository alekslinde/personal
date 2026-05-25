// Pixel ripple animation triggered on mode toggle — expanding pixel rings signal system-wide change

const PIXEL = 10;        // block size (larger than rain's 2px — intentionally visible)
const GAP = 2;           // gap between blocks
const GRID = PIXEL + GAP; // 12px grid step
const WAVE_SPEED = 420;  // px per second
const WAVE_LIFE = 1100;  // ms per wave
const WAVE_COUNT = 4;
const WAVE_STAGGER = 90; // ms between successive waves

export function triggerPixelRipple(
  origin: { x: number; y: number },
  colorPrimary: string,
  colorSecondary: string,
  direction: 'outward' | 'inward' = 'outward'
): void {
  // Respect user motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '1000';
  canvas.style.pointerEvents = 'none';

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const startTime = performance.now();
  let animationId: number | null = null;

  function tick(now: number) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let anyWaveActive = false;

    // Draw each wave
    for (let w = 0; w < WAVE_COUNT; w++) {
      const waveStartTime = startTime + w * WAVE_STAGGER;

      if (now < waveStartTime) {
        anyWaveActive = true;
        continue;
      }

      const elapsed = now - waveStartTime;
      if (elapsed > WAVE_LIFE) {
        continue;
      }

      anyWaveActive = true;
      const progress = elapsed / WAVE_LIFE;

      // Calculate radius based on direction
      let maxRadius: number;
      let opacity: number;

      if (direction === 'inward') {
        // Inward: rings contract from screen edges toward origin
        // Start at max distance and shrink inward
        const maxDistance = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);
        maxRadius = Math.max(0, maxDistance - progress * WAVE_SPEED * (WAVE_LIFE / 1000));

        // Opacity: fade in over first 15%, fade out over remaining 85%
        if (progress < 0.15) {
          opacity = progress / 0.15;
        } else {
          opacity = 1 - (progress - 0.15) / 0.85;
        }
      } else {
        // Outward: rings expand from origin outward (original behavior)
        maxRadius = progress * WAVE_SPEED * (WAVE_LIFE / 1000);

        // Opacity: fade in over first 15%, fade out over remaining 85%
        if (progress < 0.15) {
          opacity = progress / 0.15;
        } else {
          opacity = 1 - (progress - 0.15) / 0.85;
        }
      }

      // Draw pixels on the expanding ring with organic sparseness
      const searchRadius = Math.ceil((maxRadius + GRID * 2) / GRID);
      for (let gx = -searchRadius; gx <= searchRadius; gx++) {
        for (let gy = -searchRadius; gy <= searchRadius; gy++) {
          // Pixel position on the grid
          const px = Math.floor(origin.x / GRID) * GRID + gx * GRID;
          const py = Math.floor(origin.y / GRID) * GRID + gy * GRID;

          // Distance from origin to pixel center
          const centerX = px + PIXEL / 2;
          const centerY = py + PIXEL / 2;
          const dist = Math.hypot(centerX - origin.x, centerY - origin.y);

          // Draw if pixel is on or near the ring (within 1.5 grid cells of radius)
          const ringThickness = GRID * 1.5;
          if (Math.abs(dist - maxRadius) < ringThickness) {
            // Opacity based on distance from ring center (fade at edges of ring)
            const distanceFromRingCenter = Math.abs(dist - maxRadius);
            const ringOpacity = opacity * (1 - distanceFromRingCenter / ringThickness);

            // Organic sparseness: use position hash + progress for natural variation
            // Pixels near ring center are more likely to appear; edge pixels are sparser
            const centerProximity = 1 - distanceFromRingCenter / ringThickness;
            const positionHash = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
            const hashValue = positionHash - Math.floor(positionHash);

            // Draw pixel if: it's close to ring center OR random hash is favorable
            // This creates a scattered, organic look instead of solid rings
            const threshold = centerProximity * 0.85 + 0.15; // Always at least 15% chance
            if (hashValue < threshold) {
              // Alternate colors by checkerboard pattern for dithered look
              const color = (gx + gy) % 2 === 0 ? colorPrimary : colorSecondary;

              ctx.globalAlpha = Math.max(0, ringOpacity);
              ctx.fillStyle = color;
              ctx.fillRect(px, py, PIXEL - 1, PIXEL - 1); // 1px gap for grid feel
            }
          }
        }
      }
    }

    ctx.globalAlpha = 1;

    // Animation complete when all waves have finished
    const totalDuration = WAVE_LIFE + WAVE_COUNT * WAVE_STAGGER;
    if (!anyWaveActive || now - startTime > totalDuration) {
      canvas.remove();
      return;
    }

    animationId = requestAnimationFrame(tick);
  }

  animationId = requestAnimationFrame(tick);
}
