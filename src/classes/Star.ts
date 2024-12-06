import P5 from 'p5';
import { STAR_PARALLAX_FACTOR } from '~/constants';

const TILE_SIZE = 500;

function LCG(seed: number) {
  let s = seed;
  return function () {
    s = (1103515245 * s + 12345) % 2147483647;
    return s / 2147483647;
  };
}

function generateSeed(tileX: number, tileY: number) {
  const OFFSET = 1000000; // Large enough to handle negative tile indices
  const PRIME1 = 73856093;
  const PRIME2 = 19349663;
  const seed = ((tileX + OFFSET) * PRIME1) ^ ((tileY + OFFSET) * PRIME2);
  return seed >>> 0; // Convert to unsigned 32-bit integer
}

function generateStarCoordinates({
  starCount,
  tileX,
  tileY,
}: {
  tileX: number;
  tileY: number;
  starCount: number;
}) {
  const seed = generateSeed(tileX, tileY);
  const rand = LCG(seed);
  const starCoordinates = [];
  for (let i = 0; i < starCount; i++) {
    const x = rand() * TILE_SIZE + tileX * TILE_SIZE;
    const y = rand() * TILE_SIZE + tileY * TILE_SIZE;
    starCoordinates.push({ x, y });
  }
  return starCoordinates;
}

export const generateStars = ({
  centerOffset,
  P,
  starCount,
  starSize,
  zoom,
}: {
  centerOffset: { x: number; y: number };
  P: P5;
  starCount: number;
  starSize: number;
  zoom: number;
}) => {
  const rawStarData = [];

  // Adjusted centerOffset for stars
  const starCenterOffsetX = centerOffset.x * STAR_PARALLAX_FACTOR;
  const starCenterOffsetY = centerOffset.y * STAR_PARALLAX_FACTOR;

  // Compute world-space view rectangle
  const xw_left = -P.width / 2 / zoom - starCenterOffsetX;
  const xw_right = P.width / 2 / zoom - starCenterOffsetX;
  const yw_top = -P.height / 2 / zoom - starCenterOffsetY;
  const yw_bottom = P.height / 2 / zoom - starCenterOffsetY;

  // Determine visible tiles
  const minTileX = Math.floor(xw_left / TILE_SIZE);
  const maxTileX = Math.ceil(xw_right / TILE_SIZE);

  const minTileY = Math.floor(yw_top / TILE_SIZE);
  const maxTileY = Math.ceil(yw_bottom / TILE_SIZE);

  // Calculate total visible tiles
  const numTilesX = maxTileX - minTileX + 1;
  const numTilesY = maxTileY - minTileY + 1;
  const totalVisibleTiles = numTilesX * numTilesY;

  // Distribute stars across tiles
  const starsPerTile = Math.ceil(starCount / totalVisibleTiles);

  // Add stars for visible tiles
  for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
    for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
      const starCoordinates = generateStarCoordinates({
        starCount: starsPerTile,
        tileX,
        tileY,
      });
      rawStarData.push(...starCoordinates);
    }
  }

  return rawStarData.map(
    (star) =>
      new Star({
        size: P.random(0.1, 1 + starSize / zoom),
        x: star.x,
        y: star.y,
      }),
  );
};

export class Star {
  public x: number;
  public y: number;
  public size: number;

  constructor({ size, x, y }: { x: number; y: number; size: number }) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  display(P: P5) {
    P.push();
    P.fill(255);
    P.noStroke();
    P.ellipse(this.x, this.y, this.size);
    P.pop();
  }
}
