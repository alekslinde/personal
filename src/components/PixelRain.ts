// Pixel rain animation for robot mode — subtle floating dust, not Matrix
const PIXEL_SIZE = 2;
const COLUMN_WIDTH = 16; // Wider spacing between columns
const COLORS = {
  bright: '#00cc44',
  mid: '#00aa33',
  dim: '#008822',
};
const FADE_FRAMES = 80; // Longer fade = slower apparent motion
const SPEED_RANGE = [0.3, 0.7]; // Much slower pixels per frame

interface Pixel {
  x: number;
  y: number;
  age: number; // frames since it was created
  maxAge: number; // frames until fully faded
}

interface Raindrop {
  column: number;
  pixels: Pixel[];
  nextHeadY: number;
  headSpeed: number;
  headSpawnRate: number;
}

export function createRainCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.08'; // Very subtle, barely noticeable
  return canvas;
}

export function startPixelRain(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  // Create one raindrop per column
  const numColumns = Math.ceil(width / COLUMN_WIDTH);
  const raindrops: Raindrop[] = Array.from({ length: numColumns }, (_, i) => ({
    column: i,
    pixels: [],
    nextHeadY: Math.random() * height,
    headSpeed: SPEED_RANGE[0] + Math.random() * (SPEED_RANGE[1] - SPEED_RANGE[0]),
    headSpawnRate: 0.08 + Math.random() * 0.06, // Much lower spawn rate — sparse dust
  }));

  let animationId: number | null = null;
  let running = true;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw raindrops
    raindrops.forEach((drop) => {
      const x = drop.column * COLUMN_WIDTH + COLUMN_WIDTH / 2 - PIXEL_SIZE / 2;

      // Move head down and spawn new pixels
      drop.nextHeadY += drop.headSpeed;

      if (Math.random() < drop.headSpawnRate && drop.nextHeadY < height) {
        drop.pixels.push({
          x,
          y: drop.nextHeadY,
          age: 0,
          maxAge: FADE_FRAMES,
        });
      }

      // Remove pixels that are fully faded
      drop.pixels = drop.pixels.filter((p) => p.age < p.maxAge);

      // Draw and age pixels
      drop.pixels.forEach((pixel) => {
        const progress = pixel.age / pixel.maxAge;
        let color: string;

        if (progress < 0.1) {
          color = COLORS.bright;
        } else if (progress < 0.4) {
          color = COLORS.mid;
        } else {
          color = COLORS.dim;
        }

        // Fade opacity as pixel ages
        const alpha = Math.max(0, 1 - progress);
        ctx.fillStyle = color + Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0');
        ctx.fillRect(pixel.x, pixel.y, PIXEL_SIZE, PIXEL_SIZE);

        pixel.age++;
      });

      // Reset head if it goes off screen
      if (drop.nextHeadY > height) {
        drop.nextHeadY = -PIXEL_SIZE;
        drop.headSpeed = SPEED_RANGE[0] + Math.random() * (SPEED_RANGE[1] - SPEED_RANGE[0]);
      }
    });

    if (running) {
      animationId = requestAnimationFrame(animate);
    }
  }

  animationId = requestAnimationFrame(animate);

  // Return stop function
  return () => {
    running = false;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  };
}
