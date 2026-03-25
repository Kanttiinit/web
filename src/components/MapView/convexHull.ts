type Point = [number, number];

function cross(o: Point, a: Point, b: Point): number {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

export function convexHull(points: Point[]): Point[] {
  if (points.length <= 1) return [...points];

  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  if (sorted.length <= 2) return sorted;

  const lower: Point[] = [];
  for (const p of sorted) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
    ) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Point[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
    ) {
      upper.pop();
    }
    upper.push(p);
  }

  // Remove last point of each half because it's repeated
  lower.pop();
  upper.pop();

  return [...lower, ...upper];
}

export function bufferPolygon(
  points: Point[],
  paddingMeters: number = 200,
): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) {
    // Create a small square around the single point
    const offset = paddingMeters / 111320; // rough meters to degrees
    const p = points[0];
    return [
      [p[0] - offset, p[1] - offset],
      [p[0] - offset, p[1] + offset],
      [p[0] + offset, p[1] + offset],
      [p[0] + offset, p[1] - offset],
    ];
  }

  const centroid: Point = [
    points.reduce((s, p) => s + p[0], 0) / points.length,
    points.reduce((s, p) => s + p[1], 0) / points.length,
  ];

  // Convert padding from meters to approximate degrees
  const latOffset = paddingMeters / 111320;
  const lngOffset =
    paddingMeters / (111320 * Math.cos((centroid[0] * Math.PI) / 180));

  return points.map(p => {
    const dx = p[0] - centroid[0];
    const dy = p[1] - centroid[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return [p[0] + latOffset, p[1]] as Point;
    const nx = dx / dist;
    const ny = dy / dist;
    return [p[0] + nx * latOffset, p[1] + ny * lngOffset] as Point;
  });
}

export function smoothPolygon(
  points: Point[],
  iterations: number = 2,
): Point[] {
  if (points.length < 3) return [...points];

  let result = [...points];

  for (let iter = 0; iter < iterations; iter++) {
    const smoothed: Point[] = [];
    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      const next = result[(i + 1) % result.length];

      // Chaikin's corner cutting: 75/25 and 25/75 split
      smoothed.push([
        current[0] * 0.75 + next[0] * 0.25,
        current[1] * 0.75 + next[1] * 0.25,
      ]);
      smoothed.push([
        current[0] * 0.25 + next[0] * 0.75,
        current[1] * 0.25 + next[1] * 0.75,
      ]);
    }
    result = smoothed;
  }

  return result;
}
