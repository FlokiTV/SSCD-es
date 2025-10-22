/**
 * Define axis-aligned-bounding-box class.
 * Converted to TypeScript from original JavaScript code by Ronen Ness, 2015
 */

export interface Vector2D {
  x: number;
  y: number;
  clone(): Vector2D;
}

/**
 * Axis-aligned bounding box class
 * Represents a rectangular area defined by position (top-left corner) and size
 */
export class AABB {
  public position: Vector2D;
  public size: Vector2D;

  /**
   * Create a new AABB
   * @param position Top-left corner position
   * @param size Width and height dimensions
   */
  constructor(position: Vector2D, size: Vector2D) {
    this.position = position.clone();
    this.size = size.clone();
  }

  /**
   * Expand this bounding box to include another bounding box
   * @param other The other AABB to include
   */
  expand(other: AABB): void {
    // Get new bounds
    const minX = Math.min(this.position.x, other.position.x);
    const minY = Math.min(this.position.y, other.position.y);
    const maxX = Math.max(this.position.x + this.size.x, other.position.x + other.size.x);
    const maxY = Math.max(this.position.y + this.size.y, other.position.y + other.size.y);

    // Set new position and size
    this.position.x = minX;
    this.position.y = minY;
    this.size.x = maxX - minX;
    this.size.y = maxY - minY;
  }

  /**
   * Expand this bounding box to include a point (vector)
   * @param vector The point to include in the bounding box
   */
  addVector(vector: Vector2D): void {
    // Update position x
    const pushPosX = this.position.x - vector.x;
    if (pushPosX > 0) {
      this.position.x -= pushPosX;
      this.size.x += pushPosX;
    }

    // Update position y
    const pushPosY = this.position.y - vector.y;
    if (pushPosY > 0) {
      this.position.y -= pushPosY;
      this.size.y += pushPosY;
    }

    // Update size x
    const pushSizeX = vector.x - (this.position.x + this.size.x);
    if (pushSizeX > 0) {
      this.size.x += pushSizeX;
    }

    // Update size y
    const pushSizeY = vector.y - (this.position.y + this.size.y);
    if (pushSizeY > 0) {
      this.size.y += pushSizeY;
    }
  }

  /**
   * Create a copy of this AABB
   * @returns A new AABB instance with the same position and size
   */
  clone(): AABB {
    return new AABB(this.position, this.size);
  }

  /**
   * Check if this AABB intersects with another AABB
   * @param other The other AABB to check intersection with
   * @returns True if the AABBs intersect, false otherwise
   */
  intersects(other: AABB): boolean {
    return !(
      other.position.x >= this.position.x + this.size.x ||
      other.position.x + other.size.x <= this.position.x ||
      other.position.y >= this.position.y + this.size.y ||
      other.position.y + other.size.y <= this.position.y
    );
  }

  /**
   * Check if this AABB contains a point
   * @param point The point to check
   * @returns True if the point is inside the AABB
   */
  containsPoint(point: Vector2D): boolean {
    return (
      point.x >= this.position.x &&
      point.x <= this.position.x + this.size.x &&
      point.y >= this.position.y &&
      point.y <= this.position.y + this.size.y
    );
  }

  /**
   * Get the center point of this AABB
   * @returns The center point as a Vector2D
   */
  getCenter(): Vector2D {
    return {
      x: this.position.x + this.size.x / 2,
      y: this.position.y + this.size.y / 2,
      clone: function() {
        return { x: this.x, y: this.y, clone: this.clone };
      }
    };
  }

  /**
   * Get the area of this AABB
   * @returns The area (width * height)
   */
  getArea(): number {
    return this.size.x * this.size.y;
  }

  /**
   * Get the perimeter of this AABB
   * @returns The perimeter (2 * width + 2 * height)
   */
  getPerimeter(): number {
    return 2 * (this.size.x + this.size.y);
  }

  /**
   * Check if this AABB is valid (has positive dimensions)
   * @returns True if the AABB has positive width and height
   */
  isValid(): boolean {
    return this.size.x > 0 && this.size.y > 0;
  }

  /**
   * Get the minimum X coordinate
   */
  get left(): number {
    return this.position.x;
  }

  /**
   * Get the maximum X coordinate
   */
  get right(): number {
    return this.position.x + this.size.x;
  }

  /**
   * Get the minimum Y coordinate
   */
  get top(): number {
    return this.position.y;
  }

  /**
   * Get the maximum Y coordinate
   */
  get bottom(): number {
    return this.position.y + this.size.y;
  }

  /**
   * Get the width of the AABB
   */
  get width(): number {
    return this.size.x;
  }

  /**
   * Get the height of the AABB
   */
  get height(): number {
    return this.size.y;
  }
}