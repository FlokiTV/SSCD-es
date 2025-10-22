/**
 * Some useful Math functions.
 * Converted to TypeScript class from original JavaScript code by Ronen Ness, 2015
 */

export interface Point {
  x: number;
  y: number;
}

export class MathUtils {
  /**
   * Converts from degrees to radians.
   */
  static toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  /**
   * Converts from radians to degrees.
   */
  static toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  /**
   * Get distance between two points
   */
  static distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get squared distance between two points (without sqrt for performance)
   */
  static distanceSquared(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return dx * dx + dy * dy;
  }

  /**
   * Calculate angle between two points in degrees
   */
  static angle(p1: Point, p2: Point): number {
    const deltaY = p2.y - p1.y;
    const deltaX = p2.x - p1.x;
    return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  }

  /**
   * Calculate distance from point to line segment
   * @param p Point to check
   * @param v First edge of the line segment
   * @param w Second edge of the line segment
   */
  static distanceToLine(p: Point, v: Point, w: Point): number {
    const l2 = MathUtils.distanceSquared(v, w);
    const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    
    if (t < 0) {
      return MathUtils.distance(p, v);
    }
    if (t > 1) {
      return MathUtils.distance(p, w);
    }
    
    return MathUtils.distance(p, {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y)
    });
  }

  /**
   * Check if two line segments intersect
   * Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
   */
  static lineIntersects(p0: Point, p1: Point, p2: Point, p3: Point): boolean {
    const s1_x = p1.x - p0.x;
    const s1_y = p1.y - p0.y;
    const s2_x = p3.x - p2.x;
    const s2_y = p3.y - p2.y;

    const s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
  }

  /**
   * Check if point is on given line (within tolerance of 5 units)
   */
  static isOnLine(point: Point, lineStart: Point, lineEnd: Point, tolerance: number = 5): boolean {
    return MathUtils.distanceToLine(point, lineStart, lineEnd) <= tolerance;
  }

  /**
   * Return shortest, positive distance between two given angles.
   * For example:
   *  50, 100 will return 50
   *  350, 10 will return 20
   * Angles should be in 0-360 values (but negatives and >360 allowed as well)
   */
  static angleDistance(a0: number, a1: number): number {
    // Convert to radians
    const rad0 = MathUtils.toRadians(a0);
    const rad1 = MathUtils.toRadians(a1);

    // Get distance
    const max = Math.PI * 2;
    const da = (rad1 - rad0) % max;
    const distance = 2 * da % max - da;

    // Convert back to degrees and return absolute value
    return Math.abs(MathUtils.toDegrees(distance));
  }
}