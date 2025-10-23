/*
 * SSCD (Super Simple Collision Detection) - TypeScript Version
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 * 
 * Made by Ronen Ness
 * ronenness@gmail.com
 * 
 * Modified by CoMiGo Games
 * admin@nersta.ru
 * 
 * Converted to TypeScript
 */

// Types and Interfaces
export interface IVector {
  x: number;
  y: number;
}

export interface ICollisionResult {
  collided: boolean;
  distance?: number;
  direction?: Vector;
}

export type CollisionType = 'vector' | 'circle' | 'rectangle' | 'line' | 'line-strip' | 'composite-shape';

// Math utilities
export class SSCDMath {
  static toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  static toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  static distance(p1: IVector, p2: IVector): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static dist2(p1: IVector, p2: IVector): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return dx * dx + dy * dy;
  }

  static angle(p1: IVector, p2: IVector): number {
    const deltaY = p2.y - p1.y;
    const deltaX = p2.x - p1.x;
    return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  }

  static distanceToLine(p: IVector, v: IVector, w: IVector): number {
    const l2 = SSCDMath.dist2(v, w);
    const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    
    if (t < 0) {
      return SSCDMath.distance(p, v);
    }
    if (t > 1) {
      return SSCDMath.distance(p, w);
    }
    
    return SSCDMath.distance(p, {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y)
    });
  }

  static lineIntersects(p0: IVector, p1: IVector, p2: IVector, p3: IVector): boolean {
    const s1_x = p1.x - p0.x;
    const s1_y = p1.y - p0.y;
    const s2_x = p3.x - p2.x;
    const s2_y = p3.y - p2.y;

    const s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
  }

  static isOnLine(v: IVector, l1: IVector, l2: IVector): boolean {
    return SSCDMath.distanceToLine(v, l1, l2) <= 5;
  }

  static anglesDis(a0: number, a1: number): number {
    const rad0 = SSCDMath.toRadians(a0);
    const rad1 = SSCDMath.toRadians(a1);
    
    const max = Math.PI * 2;
    const da = (rad1 - rad0) % max;
    const distance = 2 * da % max - da;
    
    return Math.abs(SSCDMath.toDegrees(distance));
  }
}

// Vector class
export class Vector implements IVector {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // Static constants
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

  getName(): string {
    return "vector";
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  set(vector: IVector): this {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  flip(): Vector {
    return new Vector(this.y, this.x);
  }

  flipSelf(): this {
    const temp = this.x;
    this.x = this.y;
    this.y = temp;
    return this;
  }

  negative(): Vector {
    return this.multiplyScalar(-1);
  }

  negativeSelf(): this {
    return this.multiplyScalarSelf(-1);
  }

  distanceFrom(other: IVector): number {
    return SSCDMath.distance(this, other);
  }

  angleFrom(other: IVector): number {
    return SSCDMath.angle(this, other);
  }

  move(vector: IVector): this {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  normalizeSelf(): this {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    if (length === 0) return this;
    this.x /= length;
    this.y /= length;
    return this;
  }

  normalize(): Vector {
    return this.clone().normalizeSelf();
  }

  addSelf(other: IVector): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  subSelf(other: IVector): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  divideSelf(other: IVector): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  multiplySelf(other: IVector): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  addScalarSelf(val: number): this {
    this.x += val;
    this.y += val;
    return this;
  }

  subScalarSelf(val: number): this {
    this.x -= val;
    this.y -= val;
    return this;
  }

  divideScalarSelf(val: number): this {
    this.x /= val;
    this.y /= val;
    return this;
  }

  multiplyScalarSelf(val: number): this {
    this.x *= val;
    this.y *= val;
    return this;
  }

  add(other: IVector): Vector {
    return this.clone().addSelf(other);
  }

  sub(other: IVector): Vector {
    return this.clone().subSelf(other);
  }

  multiply(other: IVector): Vector {
    return this.clone().multiplySelf(other);
  }

  divide(other: IVector): Vector {
    return this.clone().divideSelf(other);
  }

  addScalar(val: number): Vector {
    return this.clone().addScalarSelf(val);
  }

  subScalar(val: number): Vector {
    return this.clone().subScalarSelf(val);
  }

  multiplyScalar(val: number): Vector {
    return this.clone().multiplyScalarSelf(val);
  }

  divideScalar(val: number): Vector {
    return this.clone().divideScalarSelf(val);
  }

  clamp(min: number, max: number): this {
    if (this.x < min) this.x = min;
    if (this.y < min) this.y = min;
    if (this.x > max) this.x = max;
    if (this.y > max) this.y = max;
    return this;
  }

  fromRadian(rad: number): this {
    this.x = Math.cos(rad);
    this.y = Math.sin(rad);
    return this;
  }

  fromAngle(angle: number): this {
    return this.fromRadian(SSCDMath.toRadians(angle));
  }

  applySelf(func: (val: number) => number): this {
    this.x = func(this.x);
    this.y = func(this.y);
    return this;
  }

  apply(func: (val: number) => number): Vector {
    return this.clone().applySelf(func);
  }

  debug(): void {
    console.debug(`${this.x}, ${this.y}`);
  }
}

// AABB (Axis-Aligned Bounding Box) class
export class AABB {
  public position: Vector;
  public size: Vector;

  constructor(position: Vector, size: Vector) {
    this.position = position.clone();
    this.size = size.clone();
  }

  expand(other: AABB): void {
    const minX = Math.min(this.position.x, other.position.x);
    const minY = Math.min(this.position.y, other.position.y);
    const maxX = Math.max(this.position.x + this.size.x, other.position.x + other.size.x);
    const maxY = Math.max(this.position.y + this.size.y, other.position.y + other.size.y);

    this.position.x = minX;
    this.position.y = minY;
    this.size.x = maxX - minX;
    this.size.y = maxY - minY;
  }

  addVector(vector: Vector): void {
    const pushPosX = this.position.x - vector.x;
    if (pushPosX > 0) {
      this.position.x -= pushPosX;
      this.size.x += pushPosX;
    }

    const pushPosY = this.position.y - vector.y;
    if (pushPosY > 0) {
      this.position.y -= pushPosY;
      this.size.y += pushPosY;
    }

    const pushSizeX = vector.x - (this.position.x + this.size.x);
    if (pushSizeX > 0) {
      this.size.x += pushSizeX;
    }

    const pushSizeY = vector.y - (this.position.y + this.size.y);
    if (pushSizeY > 0) {
      this.size.y += pushSizeY;
    }
  }

  clone(): AABB {
    return new AABB(this.position, this.size);
  }

  intersects(other: AABB): boolean {
    return !(other.position.x >= this.position.x + this.size.x ||
             other.position.x + other.size.x <= this.position.x ||
             other.position.y >= this.position.y + this.size.y ||
             other.position.y + other.size.y <= this.position.y);
  }
}

// Base Shape class
export abstract class Shape {
  protected __type: string = 'shape';
  protected __collisionType: CollisionType = 'vector';
  protected __position: Vector = new Vector();
  protected __data: any = null;
  protected __aabb?: AABB;
  protected __collisionTags: string[] = [];
  protected __collisionTagsVal: number = 0;
  protected __overrideFillColor?: string;
  protected __overrideStrokeColor?: string;
  
  public readonly isShape: boolean = true;

  constructor() {
    this.__position = new Vector();
  }

  abstract buildAABB(): AABB;

  getName(): string {
    return this.__type;
  }

  getType(): string {
    return this.__type;
  }

  getCollisionType(): CollisionType {
    return this.__collisionType;
  }

  setPosition(position: Vector): this {
    this.__position.set(position);
    this.__updatePositionHook();
    this.resetAABB();
    return this;
  }

  getPosition(): Vector {
    return this.__position.clone();
  }

  move(vector: Vector): this {
    this.__position.addSelf(vector);
    this.__updatePositionHook();
    this.__updateAABBPos();
    return this;
  }

  getAABB(): AABB {
    if (!this.__aabb) {
      this.__aabb = this.buildAABB();
    }
    return this.__aabb;
  }

  resetAABB(): void {
    this.__aabb = undefined;
  }

  testCollideWith(obj: Shape | Vector): boolean {
    return CollisionManager.testCollision(this, obj);
  }

  repel(obj: Shape, force: number = 1, iterations: number = 1, factorSelf: number = 0, factorOther: number = 1): Vector {
    const pushVector = this.getRepelDirection(obj).multiplyScalarSelf(force);
    const pushVectorOther = factorOther ? pushVector.multiplyScalar(factorOther) : null;
    const pushVectorSelf = factorSelf ? pushVector.multiplyScalar(factorSelf * -1) : null;

    const ret = Vector.ZERO.clone();
    let collide = true;

    while (collide && iterations > 0) {
      iterations--;

      if (pushVectorOther && 'move' in obj) {
        (obj as any).move(pushVectorOther);
      }
      if (pushVectorSelf) {
        this.move(pushVectorSelf);
      }
      ret.addSelf(pushVector);

      collide = this.testCollideWith(obj);
    }

    return ret;
  }

  getRepelDirection(obj: Shape | Vector): Vector {
    if (obj instanceof Vector) {
      return obj.sub(this.__position).normalizeSelf();
    }
    
    // Calculate collision point based repel direction
    return this.getCollisionBasedRepelDirection(obj);
  }

  protected getCollisionBasedRepelDirection(obj: Shape): Vector {
    // Default implementation uses center-to-center direction
    return obj.__position.sub(this.__position).normalizeSelf();
  }

  setData(data: any): this {
    this.__data = data;
    return this;
  }

  getData(): any {
    return this.__data;
  }

  protected __updatePositionHook(): void {
    // Override in subclasses
  }

  protected __updateAABBPos(): void {
    if (this.__aabb) {
      // Default implementation - override in subclasses if needed
    }
  }
}

// Circle shape
export class Circle extends Shape {
  protected __type = 'circle';
  protected __collisionType: CollisionType = 'circle';
  private __radius: number;

  constructor(position: Vector, radius: number) {
    super();
    this.setPosition(position);
    this.__radius = radius;
  }

  getRadius(): number {
    return this.__radius;
  }

  setRadius(radius: number): this {
    this.__radius = radius;
    this.resetAABB();
    return this;
  }

  buildAABB(): AABB {
    const size = new Vector(this.__radius * 2, this.__radius * 2);
    const position = this.__position.sub(new Vector(this.__radius, this.__radius));
    return new AABB(position, size);
  }

  getRepelDirection(obj: Shape | Vector): Vector {
    const otherPos = obj instanceof Vector ? obj : (obj as Circle).getPosition();
    return this.__position.sub(otherPos).normalizeSelf();
  }
}

// Rectangle shape
export class Rectangle extends Shape {
  protected __type = 'rectangle';
  protected __collisionType: CollisionType = 'rectangle';
  private __size: Vector;
  private __topLeftC?: Vector;
  private __topRightC?: Vector;
  private __bottomLeftC?: Vector;
  private __bottomRightC?: Vector;
  private __absCenterC?: Vector;

  constructor(position: Vector, size: Vector) {
    super();
    this.setPosition(position);
    this.__size = size.clone();
  }

  getSize(): Vector {
    return this.__size.clone();
  }

  setSize(size: Vector): this {
    this.__size.set(size);
    this.resetAABB();
    this.__updatePositionHook();
    return this;
  }

  buildAABB(): AABB {
    return new AABB(this.__position, this.__size);
  }

  getTopLeft(): Vector {
    if (!this.__topLeftC) {
      this.__topLeftC = this.__position.clone();
    }
    return this.__topLeftC;
  }

  getBottomLeft(): Vector {
    if (!this.__bottomLeftC) {
      this.__bottomLeftC = this.__position.add(new Vector(0, this.__size.y));
    }
    return this.__bottomLeftC;
  }

  getTopRight(): Vector {
    if (!this.__topRightC) {
      this.__topRightC = this.__position.add(new Vector(this.__size.x, 0));
    }
    return this.__topRightC;
  }

  getBottomRight(): Vector {
    if (!this.__bottomRightC) {
      this.__bottomRightC = this.__position.add(new Vector(this.__size.x, this.__size.y));
    }
    return this.__bottomRightC;
  }

  getAbsCenter(): Vector {
    if (!this.__absCenterC) {
      this.__absCenterC = this.__position.add(this.__size.divideScalar(2));
    }
    return this.__absCenterC;
  }

  protected __updatePositionHook(): void {
    this.__topLeftC = undefined;
    this.__topRightC = undefined;
    this.__bottomLeftC = undefined;
    this.__bottomRightC = undefined;
    this.__absCenterC = undefined;
  }

  protected getCollisionBasedRepelDirection(obj: Shape): Vector {
    // For rectangles, calculate repel direction based on closest edge/corner
    const objCenter = obj instanceof Rectangle ? obj.getAbsCenter() : obj.getPosition();
    const thisCenter = this.getAbsCenter();
    
    // Get rectangle bounds
    const left = this.__position.x;
    const right = this.__position.x + this.__size.x;
    const top = this.__position.y;
    const bottom = this.__position.y + this.__size.y;
    
    // Find closest point on rectangle to the object
    const closestX = Math.max(left, Math.min(objCenter.x, right));
    const closestY = Math.max(top, Math.min(objCenter.y, bottom));
    const closestPoint = new Vector(closestX, closestY);
    
    // Calculate direction from closest point to object center
    const direction = objCenter.sub(closestPoint);
    
    // If object is inside rectangle, use center-to-center direction
    if (direction.x * direction.x + direction.y * direction.y < 0.001) {
      return objCenter.sub(thisCenter).normalizeSelf();
    }
    
    return direction.normalizeSelf();
  }
}

// Line shape
export class Line extends Shape {
  protected __type = 'line';
  protected __collisionType: CollisionType = 'line';
  private __dest: Vector;
  private __p1C?: Vector;
  private __p2C?: Vector;

  constructor(source: Vector, dest: Vector) {
    super();
    this.__dest = dest;
    this.setPosition(source);
  }

  buildAABB(): AABB {
    const pos = new Vector(0, 0);
    pos.x = this.__dest.x > 0 ? this.__position.x : this.__position.x + this.__dest.x;
    pos.y = this.__dest.y > 0 ? this.__position.y : this.__position.y + this.__dest.y;
    const size = this.__dest.apply(Math.abs);
    return new AABB(pos, size);
  }

  getP1(): Vector {
    if (!this.__p1C) {
      this.__p1C = this.__position.clone();
    }
    return this.__p1C;
  }

  getP2(): Vector {
    if (!this.__p2C) {
      this.__p2C = this.__position.add(this.__dest);
    }
    return this.__p2C;
  }

  protected __updatePositionHook(): void {
    this.__p1C = undefined;
    this.__p2C = undefined;
  }
}

// LineStrip shape
export class LineStrip extends Shape {
  protected __type = 'line-strip';
  protected __collisionType: CollisionType = 'line-strip';
  private __points: Vector[];
  private __absLinesC?: [Vector, Vector][];
  private __absPointsC?: Vector[];
  private __aabbOffsetC?: Vector;

  constructor(position: Vector, points: Vector[], closed: boolean = false) {
    super();
    
    if (points.length <= 1) {
      throw new Error('Not enough vectors for LineStrip (got to have at least two vectors)');
    }

    this.__points = points;
    
    if (closed) {
      this.__points.push(this.__points[0]);
    }

    this.setPosition(position);
  }

  getAbsLines(): [Vector, Vector][] {
    if (this.__absLinesC) {
      return this.__absLinesC;
    }

    const points = this.getAbsPoints();
    const ret: [Vector, Vector][] = [];
    for (let i = 0; i < points.length - 1; i++) {
      ret.push([points[i], points[i + 1]]);
    }

    this.__absLinesC = ret;
    return ret;
  }

  getAbsPoints(): Vector[] {
    if (this.__absPointsC) {
      return this.__absPointsC;
    }

    const ret: Vector[] = [];
    for (let i = 0; i < this.__points.length; i++) {
      ret.push(this.__points[i].add(this.__position));
    }

    this.__absPointsC = ret;
    return ret;
  }

  buildAABB(): AABB {
    const ret = new AABB(Vector.ZERO, Vector.ZERO);
    for (let i = 0; i < this.__points.length; ++i) {
      ret.addVector(this.__points[i]);
    }
    this.__aabbOffsetC = ret.position.clone();
    ret.position.addSelf(this.__position);
    return ret;
  }

  protected __updatePositionHook(): void {
    this.__absPointsC = undefined;
    this.__absLinesC = undefined;
  }

  protected __updateAABBPos(): void {
    if (this.__aabb && this.__aabbOffsetC) {
      this.__aabb.position.set(this.__aabbOffsetC.add(this.__position));
    }
  }
}

// CompositeShape
export class CompositeShape extends Shape {
  protected __type = 'composite-shape';
  protected __collisionType: CollisionType = 'composite-shape';
  private __shapes: Array<{ shape: Shape; offset: Vector }> = [];
  private __shapesListC?: Shape[];
  private __aabbPosOffsetC?: Vector;

  constructor(position?: Vector, objects?: Shape[]) {
    super();
    
    const pos = position || Vector.ZERO;
    this.setPosition(pos);

    if (objects) {
      for (const obj of objects) {
        this.add(obj);
      }
    }
  }

  repel(obj: Shape, force: number = 1, iterations: number = 1, factorSelf: number = 0, factorOther: number = 1): Vector {
    const ret = Vector.ZERO.clone();
    
    for (const shapeData of this.__shapes) {
      const shape = shapeData.shape;
      if (shape.testCollideWith(obj)) {
        ret.addSelf(shape.repel(obj, force, iterations, 0, factorOther));
      }
    }

    if (factorSelf !== 0) {
      this.move(ret.multiplyScalar(factorSelf * -1));
    }

    return ret;
  }

  getShapes(): Shape[] {
    if (this.__shapesListC) {
      return this.__shapesListC;
    }

    const ret: Shape[] = [];
    for (const shapeData of this.__shapes) {
      ret.push(shapeData.shape);
    }

    this.__shapesListC = ret;
    return ret;
  }

  buildAABB(): AABB {
    if (this.__shapes.length === 0) {
      this.__aabbPosOffsetC = Vector.ZERO;
      return new AABB(Vector.ZERO, Vector.ZERO);
    }

    let ret: AABB | null = null;
    for (const shapeData of this.__shapes) {
      const currAABB = shapeData.shape.getAABB();
      if (ret) {
        ret.expand(currAABB);
      } else {
        ret = currAABB;
      }
    }

    if (ret) {
      this.__aabbPosOffsetC = ret.position.sub(this.__position);
    }

    return ret || new AABB(Vector.ZERO, Vector.ZERO);
  }

  add(shape: Shape): Shape {
    const offset = shape.getPosition();
    this.__shapesListC = undefined;

    this.__shapes.push({
      shape: shape,
      offset: offset.clone()
    });
    
    shape.setPosition(this.__position.add(offset));
    this.resetAABB();

    return shape;
  }

  remove(shape: Shape): void {
    this.__shapesListC = undefined;
    
    for (let i = 0; i < this.__shapes.length; ++i) {
      if (this.__shapes[i].shape === shape) {
        this.__shapes.splice(i, 1);
        return;
      }
    }

    throw new Error("Shape to remove is not in composite shape!");
  }

  protected __updatePositionHook(): void {
    for (const shapeData of this.__shapes) {
      shapeData.shape.setPosition(this.__position.add(shapeData.offset));
    }
  }

  protected __updateAABBPos(): void {
    if (this.__aabb && this.__aabbPosOffsetC) {
      this.__aabb.position = this.__position.add(this.__aabbPosOffsetC);
    }
  }
}

// Collision Manager
export class CollisionManager {
  static testCollision(a: Shape | Vector, b: Shape | Vector): boolean {
    // Vector to Vector
    if (a instanceof Vector && b instanceof Vector) {
      return a.x === b.x && a.y === b.y;
    }

    // Vector to Shape
    if (a instanceof Vector && b instanceof Shape) {
      return this.testCollisionVectorShape(a, b);
    }

    // Shape to Vector
    if (a instanceof Shape && b instanceof Vector) {
      return this.testCollisionVectorShape(b, a);
    }

    // Shape to Shape
    if (a instanceof Shape && b instanceof Shape) {
      return this.testCollisionShapeShape(a, b);
    }

    return false;
  }

  private static testCollisionVectorShape(vector: Vector, shape: Shape): boolean {
    switch (shape.getCollisionType()) {
      case 'circle':
        return this.testCollisionCircleVector(shape as Circle, vector);
      case 'rectangle':
        return this.testCollisionRectVector(shape as Rectangle, vector);
      case 'line':
        return this.testCollisionLineVector(shape as Line, vector);
      case 'line-strip':
        return this.testCollisionLineStripVector(shape as LineStrip, vector);
      case 'composite-shape':
        return this.testCollisionCompositeVector(shape as CompositeShape, vector);
      default:
        return false;
    }
  }

  private static testCollisionShapeShape(a: Shape, b: Shape): boolean {
    const typeA = a.getCollisionType();
    const typeB = b.getCollisionType();

    // Circle collisions
    if (typeA === 'circle' && typeB === 'circle') {
      return this.testCollisionCircleCircle(a as Circle, b as Circle);
    }
    if (typeA === 'circle' && typeB === 'rectangle') {
      return this.testCollisionCircleRect(a as Circle, b as Rectangle);
    }
    if (typeA === 'rectangle' && typeB === 'circle') {
      return this.testCollisionCircleRect(b as Circle, a as Rectangle);
    }

    // Rectangle collisions
    if (typeA === 'rectangle' && typeB === 'rectangle') {
      return this.testCollisionRectRect(a as Rectangle, b as Rectangle);
    }

    // Line collisions
    if (typeA === 'line' && typeB === 'line') {
      return this.testCollisionLineLine(a as Line, b as Line);
    }

    // LineStrip collisions
    if (typeA === 'line-strip' && typeB === 'line-strip') {
      return this.testCollisionLineStripLineStrip(a as LineStrip, b as LineStrip);
    }
    if (typeA === 'line-strip' && typeB === 'rectangle') {
      return this.testCollisionLineStripRect(a as LineStrip, b as Rectangle);
    }
    if (typeA === 'rectangle' && typeB === 'line-strip') {
      return this.testCollisionLineStripRect(b as LineStrip, a as Rectangle);
    }

    // Composite shape collisions
    if (typeA === 'composite-shape' || typeB === 'composite-shape') {
      const composite = typeA === 'composite-shape' ? a as CompositeShape : b as CompositeShape;
      const other = typeA === 'composite-shape' ? b : a;
      return this.testCollisionCompositeShape(composite, other);
    }

    return false;
  }

  private static testCollisionCircleVector(circle: Circle, vector: Vector): boolean {
    return SSCDMath.distance(circle.getPosition(), vector) <= circle.getRadius();
  }

  private static testCollisionRectVector(rect: Rectangle, vector: Vector): boolean {
    const pos = rect.getPosition();
    const size = rect.getSize();
    return vector.x >= pos.x && vector.x <= pos.x + size.x &&
           vector.y >= pos.y && vector.y <= pos.y + size.y;
  }

  private static testCollisionLineVector(line: Line, vector: Vector): boolean {
    return SSCDMath.isOnLine(vector, line.getP1(), line.getP2());
  }

  private static testCollisionLineStripVector(lineStrip: LineStrip, vector: Vector): boolean {
    const lines = lineStrip.getAbsLines();
    for (const line of lines) {
      if (SSCDMath.isOnLine(vector, line[0], line[1])) {
        return true;
      }
    }
    return false;
  }

  private static testCollisionCompositeVector(composite: CompositeShape, vector: Vector): boolean {
    const shapes = composite.getShapes();
    for (const shape of shapes) {
      if (this.testCollisionVectorShape(vector, shape)) {
        return true;
      }
    }
    return false;
  }

  private static testCollisionCircleCircle(a: Circle, b: Circle): boolean {
    const distance = SSCDMath.distance(a.getPosition(), b.getPosition());
    return distance <= a.getRadius() + b.getRadius();
  }

  private static testCollisionCircleRect(circle: Circle, rect: Rectangle): boolean {
    const circlePos = circle.getPosition();
    
    // Check if circle center is inside rectangle
    if (this.testCollisionRectVector(rect, circlePos)) {
      return true;
    }

    const rectCenter = rect.getAbsCenter();
    
    // Check collision between rect center and circle
    if (this.testCollisionCircleVector(circle, rectCenter)) {
      return true;
    }

    // Check distance to rectangle edges
    const lines: [Vector, Vector][] = [];
    if (rectCenter.x > circlePos.x) {
      lines.push([rect.getTopLeft(), rect.getBottomLeft()]);
    } else {
      lines.push([rect.getTopRight(), rect.getBottomRight()]);
    }
    if (rectCenter.y > circlePos.y) {
      lines.push([rect.getTopLeft(), rect.getTopRight()]);
    } else {
      lines.push([rect.getBottomLeft(), rect.getBottomRight()]);
    }

    for (const line of lines) {
      const distToLine = SSCDMath.distanceToLine(circlePos, line[0], line[1]);
      if (distToLine <= circle.getRadius()) {
        return true;
      }
    }

    return false;
  }

  private static testCollisionRectRect(a: Rectangle, b: Rectangle): boolean {
    const aPos = a.getPosition();
    const aSize = a.getSize();
    const bPos = b.getPosition();
    const bSize = b.getSize();

    return !(bPos.x >= aPos.x + aSize.x ||
             bPos.x + bSize.x <= aPos.x ||
             bPos.y >= aPos.y + aSize.y ||
             bPos.y + bSize.y <= aPos.y);
  }

  private static testCollisionLineLine(a: Line, b: Line): boolean {
    return SSCDMath.lineIntersects(a.getP1(), a.getP2(), b.getP1(), b.getP2());
  }

  private static testCollisionLineStripRect(lineStrip: LineStrip, rect: Rectangle): boolean {
    const r1 = rect.getTopLeft();
    const r2 = rect.getBottomLeft();
    const r3 = rect.getTopRight();
    const r4 = rect.getBottomRight();

    const lines = lineStrip.getAbsLines();
    for (const line of lines) {
      const p1 = line[0];
      const p2 = line[1];

      // Check intersection with all rectangle sides
      if (SSCDMath.lineIntersects(p1, p2, r1, r2) ||
          SSCDMath.lineIntersects(p1, p2, r3, r4) ||
          SSCDMath.lineIntersects(p1, p2, r1, r3) ||
          SSCDMath.lineIntersects(p1, p2, r2, r4)) {
        return true;
      }
    }

    return false;
  }

  private static testCollisionLineStripLineStrip(a: LineStrip, b: LineStrip): boolean {
    const linesA = a.getAbsLines();
    const linesB = b.getAbsLines();
    
    for (const lineA of linesA) {
      for (const lineB of linesB) {
        if (SSCDMath.lineIntersects(lineA[0], lineA[1], lineB[0], lineB[1])) {
          return true;
        }
      }
    }
    
    return false;
  }

  private static testCollisionCompositeShape(composite: CompositeShape, other: Shape): boolean {
    const compShapes = composite.getShapes();

    if (other instanceof CompositeShape) {
      const otherShapes = other.getShapes();
      for (const compShape of compShapes) {
        for (const otherShape of otherShapes) {
          if (this.testCollision(compShape, otherShape)) {
            return true;
          }
        }
      }
    } else {
      for (const compShape of compShapes) {
        if (this.testCollision(compShape, other)) {
          return true;
        }
      }
    }

    return false;
  }
}

// Custom Errors
export class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message || "");
    this.name = "NotImplementedError";
  }
}

export class UnsupportedShapesError extends Error {
  constructor(a: Shape, b: Shape) {
    super(`Unsupported shapes collision test! '${a.getName()}' <-> '${b.getName()}'.`);
    this.name = 'UnsupportedShapesError';
  }
}

export class IllegalActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalActionError';
  }
}

// Main SSCD namespace object
export const SSCD = {
  VERSION: 1.5,
  Math: SSCDMath,
  Vector,
  AABB,
  Shape,
  Circle,
  Rectangle,
  Line,
  LineStrip,
  CompositeShape,
  CollisionManager,
  NotImplementedError,
  UnsupportedShapesError,
  IllegalActionError
};

// Default export
export default SSCD;