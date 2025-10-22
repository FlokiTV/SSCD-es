/**
 * This file defines the 2D vector class & utilities.
 * Converted to TypeScript from original JavaScript code by Ronen Ness, 2015
 */

import { MathUtils } from './math';

/**
 * A 2D vector class with comprehensive mathematical operations
 */
export class Vector {
  public x: number;
  public y: number;

  /**
   * Create a new Vector
   * @param x The x component (default: 0)
   * @param y The y component (default: 0)
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get the name of this object for debug purposes
   * @returns The string "vector"
   */
  getName(): string {
    return "vector";
  }

  /**
   * Create a copy of this vector
   * @returns A new Vector instance with the same x and y values
   */
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
   * Set this vector's values from another vector
   * @param vector The vector to copy values from
   * @returns This vector for chaining
   */
  set(vector: Vector): Vector {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  /**
   * Create a new vector with x and y flipped
   * @returns A new Vector with swapped coordinates
   */
  flip(): Vector {
    return new Vector(this.y, this.x);
  }

  /**
   * Flip x and y coordinates of this vector
   * @returns This vector for chaining
   */
  flipSelf(): Vector {
    [this.x, this.y] = [this.y, this.x];
    return this;
  }

  /**
   * Create a new vector that is the negative of this one
   * @returns A new Vector with negated coordinates
   */
  negative(): Vector {
    return this.multiplyScalar(-1);
  }

  /**
   * Negate this vector (multiply by -1)
   * @returns This vector for chaining
   */
  negativeSelf(): Vector {
    this.multiplyScalarSelf(-1);
    return this;
  }

  /**
   * Get distance from another vector
   * @param other The other vector
   * @returns The distance between vectors
   */
  distanceFrom(other: Vector): number {
    return MathUtils.distance(this, other);
  }

  /**
   * Get angle from another vector in degrees
   * @param other The other vector
   * @returns The angle in degrees
   */
  angleFrom(other: Vector): number {
    return MathUtils.angle(this, other);
  }

  /**
   * Move this vector by adding another vector (alias for addSelf)
   * @param vector The vector to add
   * @returns This vector for chaining
   */
  move(vector: Vector): Vector {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Normalize this vector (make it unit length)
   * @returns This vector for chaining
   */
  normalizeSelf(): Vector {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    if (magnitude === 0) return this;
    this.x /= magnitude;
    this.y /= magnitude;
    return this;
  }

  /**
   * Get a normalized copy of this vector
   * @returns A new normalized Vector
   */
  normalize(): Vector {
    return this.clone().normalizeSelf();
  }

  /**
   * Add another vector to this vector
   * @param other The vector to add
   * @returns This vector for chaining
   */
  addSelf(other: Vector): Vector {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Subtract another vector from this vector
   * @param other The vector to subtract
   * @returns This vector for chaining
   */
  subSelf(other: Vector): Vector {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * Divide this vector by another vector (component-wise)
   * @param other The vector to divide by
   * @returns This vector for chaining
   */
  divideSelf(other: Vector): Vector {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  /**
   * Multiply this vector by another vector (component-wise)
   * @param other The vector to multiply by
   * @returns This vector for chaining
   */
  multiplySelf(other: Vector): Vector {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  /**
   * Add a scalar value to both components
   * @param val The scalar value to add
   * @returns This vector for chaining
   */
  addScalarSelf(val: number): Vector {
    this.x += val;
    this.y += val;
    return this;
  }

  /**
   * Subtract a scalar value from both components
   * @param val The scalar value to subtract
   * @returns This vector for chaining
   */
  subScalarSelf(val: number): Vector {
    this.x -= val;
    this.y -= val;
    return this;
  }

  /**
   * Divide both components by a scalar value
   * @param val The scalar value to divide by
   * @returns This vector for chaining
   */
  divideScalarSelf(val: number): Vector {
    this.x /= val;
    this.y /= val;
    return this;
  }

  /**
   * Multiply both components by a scalar value
   * @param val The scalar value to multiply by
   * @returns This vector for chaining
   */
  multiplyScalarSelf(val: number): Vector {
    this.x *= val;
    this.y *= val;
    return this;
  }

  /**
   * Add another vector without changing this vector
   * @param other The vector to add
   * @returns A new Vector with the result
   */
  add(other: Vector): Vector {
    return this.clone().addSelf(other);
  }

  /**
   * Subtract another vector without changing this vector
   * @param other The vector to subtract
   * @returns A new Vector with the result
   */
  sub(other: Vector): Vector {
    return this.clone().subSelf(other);
  }

  /**
   * Multiply by another vector without changing this vector
   * @param other The vector to multiply by
   * @returns A new Vector with the result
   */
  multiply(other: Vector): Vector {
    return this.clone().multiplySelf(other);
  }

  /**
   * Divide by another vector without changing this vector
   * @param other The vector to divide by
   * @returns A new Vector with the result
   */
  divide(other: Vector): Vector {
    return this.clone().divideSelf(other);
  }

  /**
   * Add a scalar without changing this vector
   * @param val The scalar value to add
   * @returns A new Vector with the result
   */
  addScalar(val: number): Vector {
    return this.clone().addScalarSelf(val);
  }

  /**
   * Subtract a scalar without changing this vector
   * @param val The scalar value to subtract
   * @returns A new Vector with the result
   */
  subScalar(val: number): Vector {
    return this.clone().subScalarSelf(val);
  }

  /**
   * Multiply by a scalar without changing this vector
   * @param val The scalar value to multiply by
   * @returns A new Vector with the result
   */
  multiplyScalar(val: number): Vector {
    return this.clone().multiplyScalarSelf(val);
  }

  /**
   * Divide by a scalar without changing this vector
   * @param val The scalar value to divide by
   * @returns A new Vector with the result
   */
  divideScalar(val: number): Vector {
    return this.clone().divideScalarSelf(val);
  }

  /**
   * Clamp vector components between min and max values
   * @param min The minimum value
   * @param max The maximum value
   * @returns This vector for chaining
   */
  clamp(min: number, max: number): Vector {
    if (this.x < min) this.x = min;
    if (this.y < min) this.y = min;
    if (this.x > max) this.x = max;
    if (this.y > max) this.y = max;
    return this;
  }

  /**
   * Set this vector from a radian angle (unit vector)
   * @param rad The angle in radians
   * @returns This vector for chaining
   */
  fromRadian(rad: number): Vector {
    this.x = Math.cos(rad);
    this.y = Math.sin(rad);
    return this;
  }

  /**
   * Set this vector from a degree angle (unit vector)
   * @param angle The angle in degrees
   * @returns This vector for chaining
   */
  fromAngle(angle: number): Vector {
    return this.fromRadian(MathUtils.toRadians(angle));
  }

  /**
   * Apply a function to both x and y components
   * @param func The function to apply
   * @returns This vector for chaining
   */
  applySelf(func: (value: number) => number): Vector {
    this.x = func(this.x);
    this.y = func(this.y);
    return this;
  }

  /**
   * Apply a function to both x and y components without changing this vector
   * @param func The function to apply
   * @returns A new Vector with the result
   */
  apply(func: (value: number) => number): Vector {
    return this.clone().applySelf(func);
  }

  /**
   * Print debug information to console
   */
  debug(): void {
    console.debug(`${this.x}, ${this.y}`);
  }

  // Additional utility methods

  /**
   * Get the magnitude (length) of this vector
   * @returns The magnitude of the vector
   */
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get the squared magnitude of this vector (faster than magnitude)
   * @returns The squared magnitude
   */
  get magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Calculate dot product with another vector
   * @param other The other vector
   * @returns The dot product
   */
  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Calculate cross product with another vector (2D cross product returns scalar)
   * @param other The other vector
   * @returns The cross product (scalar)
   */
  cross(other: Vector): number {
    return this.x * other.y - this.y * other.x;
  }

  /**
   * Get the angle of this vector in radians
   * @returns The angle in radians
   */
  get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Get the angle of this vector in degrees
   * @returns The angle in degrees
   */
  get angleDegrees(): number {
    return MathUtils.toDegrees(this.angle);
  }

  /**
   * Check if this vector equals another vector (with optional tolerance)
   * @param other The other vector
   * @param tolerance The tolerance for comparison (default: 0)
   * @returns True if vectors are equal within tolerance
   */
  equals(other: Vector, tolerance: number = 0): boolean {
    return Math.abs(this.x - other.x) <= tolerance && Math.abs(this.y - other.y) <= tolerance;
  }

  /**
   * Get a perpendicular vector (rotated 90 degrees counter-clockwise)
   * @returns A new perpendicular Vector
   */
  perpendicular(): Vector {
    return new Vector(-this.y, this.x);
  }

  /**
   * Linear interpolation between this vector and another
   * @param other The target vector
   * @param t The interpolation factor (0-1)
   * @returns A new Vector with interpolated values
   */
  lerp(other: Vector, t: number): Vector {
    return new Vector(
      this.x + (other.x - this.x) * t,
      this.y + (other.y - this.y) * t
    );
  }

  /**
   * Convert to string representation
   * @returns String representation of the vector
   */
  toString(): string {
    return `Vector(${this.x}, ${this.y})`;
  }

  // Static constants for common vectors
  static readonly ZERO = new Vector(0, 0);
  static readonly ONE = new Vector(1, 1);
  static readonly UP = new Vector(0, -1);
  static readonly DOWN = new Vector(0, 1);
  static readonly LEFT = new Vector(-1, 0);
  static readonly RIGHT = new Vector(1, 0);
  static readonly UP_LEFT = new Vector(-1, -1);
  static readonly DOWN_LEFT = new Vector(-1, 1);
  static readonly UP_RIGHT = new Vector(1, -1);
  static readonly DOWN_RIGHT = new Vector(1, 1);

  // Static utility methods

  /**
   * Create a vector from polar coordinates
   * @param magnitude The magnitude (length)
   * @param angle The angle in radians
   * @returns A new Vector
   */
  static fromPolar(magnitude: number, angle: number): Vector {
    return new Vector(
      magnitude * Math.cos(angle),
      magnitude * Math.sin(angle)
    );
  }

  /**
   * Create a vector from polar coordinates with angle in degrees
   * @param magnitude The magnitude (length)
   * @param angleDegrees The angle in degrees
   * @returns A new Vector
   */
  static fromPolarDegrees(magnitude: number, angleDegrees: number): Vector {
    return Vector.fromPolar(magnitude, MathUtils.toRadians(angleDegrees));
  }

  /**
   * Calculate distance between two vectors
   * @param a First vector
   * @param b Second vector
   * @returns The distance between vectors
   */
  static distance(a: Vector, b: Vector): number {
    return MathUtils.distance(a, b);
  }

  /**
   * Calculate angle between two vectors in degrees
   * @param a First vector
   * @param b Second vector
   * @returns The angle in degrees
   */
  static angle(a: Vector, b: Vector): number {
    return MathUtils.angle(a, b);
  }
}