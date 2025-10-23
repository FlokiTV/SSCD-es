/**
 * Rectangle collision tests
 * Tests for the Rectangle class collision detection and geometric operations
 */
import {expect, test, describe, beforeEach} from 'bun:test';
import { Rectangle } from '../src/shapes/rectangle';
import { Vector } from '../src/utils/vector';
import { AABB } from '../src/utils/aabb';

describe('Rectangle', () => {
  let rect1: Rectangle;
  let rect2: Rectangle;

  beforeEach(() => {
    // Create test rectangles
    rect1 = new Rectangle(new Vector(0, 0), new Vector(10, 10));
    rect2 = new Rectangle(new Vector(5, 5), new Vector(10, 10));
  });

  describe('Creation and Basic Properties', () => {
    test('should create rectangle with correct position and size', () => {
      const rect = new Rectangle(new Vector(10, 20), new Vector(30, 40));
      
      expect(rect.getPosition().x).toBe(10);
      expect(rect.getPosition().y).toBe(20);
      expect(rect.getSize().x).toBe(30);
      expect(rect.getSize().y).toBe(40);
      expect(rect.rectWidth).toBe(30);
      expect(rect.rectHeight).toBe(40);
    });

    test('should have correct type and collision type', () => {
      expect(rect1.getName()).toBe('rectangle');
      expect(rect1.getCollisionType()).toBe('rectangle');
    });

    test('should calculate area and perimeter correctly', () => {
      expect(rect1.getArea()).toBe(100); // 10 * 10
      expect(rect1.getPerimeter()).toBe(40); // 2 * (10 + 10)
    });

    test('should build correct AABB', () => {
      const aabb = rect1.buildAABB();
      expect(aabb.position.x).toBe(0);
      expect(aabb.position.y).toBe(0);
      expect(aabb.size.x).toBe(10);
      expect(aabb.size.y).toBe(10);
    });
  });

  describe('Corner Methods', () => {
    test('should return correct corner positions', () => {
      const topLeft = rect1.getTopLeft();
      const topRight = rect1.getTopRight();
      const bottomLeft = rect1.getBottomLeft();
      const bottomRight = rect1.getBottomRight();

      expect(topLeft.x).toBe(0);
      expect(topLeft.y).toBe(0);
      
      expect(topRight.x).toBe(10);
      expect(topRight.y).toBe(0);
      
      expect(bottomLeft.x).toBe(0);
      expect(bottomLeft.y).toBe(10);
      
      expect(bottomRight.x).toBe(10);
      expect(bottomRight.y).toBe(10);
    });

    test('should return all corners in correct order', () => {
      const corners = rect1.getCorners();
      
      expect(corners).toHaveLength(4);
      expect(corners[0]).toEqual(rect1.getTopLeft());
      expect(corners[1]).toEqual(rect1.getTopRight());
      expect(corners[2]).toEqual(rect1.getBottomRight());
      expect(corners[3]).toEqual(rect1.getBottomLeft());
    });

    test('should return correct absolute center', () => {
      const center = rect1.getAbsCenter();
      expect(center.x).toBe(5);
      expect(center.y).toBe(5);
    });
  });

  describe('Point Collision Detection', () => {
    test('should detect point inside rectangle', () => {
      expect(rect1.containsPoint(new Vector(5, 5))).toBe(true);
      expect(rect1.containsPoint(new Vector(0, 0))).toBe(true); // Top-left corner
      expect(rect1.containsPoint(new Vector(10, 10))).toBe(true); // Bottom-right corner
      expect(rect1.containsPoint(new Vector(2, 8))).toBe(true);
    });

    test('should detect point outside rectangle', () => {
      expect(rect1.containsPoint(new Vector(-1, 5))).toBe(false);
      expect(rect1.containsPoint(new Vector(5, -1))).toBe(false);
      expect(rect1.containsPoint(new Vector(11, 5))).toBe(false);
      expect(rect1.containsPoint(new Vector(5, 11))).toBe(false);
      expect(rect1.containsPoint(new Vector(15, 15))).toBe(false);
    });

    test('should handle edge cases for point detection', () => {
      expect(rect1.containsPoint(new Vector(0, 5))).toBe(true); // Left edge
      expect(rect1.containsPoint(new Vector(10, 5))).toBe(true); // Right edge
      expect(rect1.containsPoint(new Vector(5, 0))).toBe(true); // Top edge
      expect(rect1.containsPoint(new Vector(5, 10))).toBe(true); // Bottom edge
    });
  });

  describe('Rectangle-Rectangle Collision Detection', () => {
    test('should detect overlapping rectangles', () => {
      // rect1: (0,0) to (10,10)
      // rect2: (5,5) to (15,15) - overlaps
      expect(rect1.intersectsRectangle(rect2)).toBe(true);
      expect(rect2.intersectsRectangle(rect1)).toBe(true);
    });

    test('should detect non-overlapping rectangles', () => {
      const rect3 = new Rectangle(new Vector(15, 15), new Vector(5, 5));
      expect(rect1.intersectsRectangle(rect3)).toBe(false);
      expect(rect3.intersectsRectangle(rect1)).toBe(false);
    });

    test('should detect touching rectangles', () => {
      const rect3 = new Rectangle(new Vector(10, 0), new Vector(5, 10)); // Touching right edge
      const rect4 = new Rectangle(new Vector(0, 10), new Vector(10, 5)); // Touching bottom edge
      
      expect(rect1.intersectsRectangle(rect3)).toBe(true);
      expect(rect1.intersectsRectangle(rect4)).toBe(true);
    });

    test('should handle identical rectangles', () => {
      const rect3 = new Rectangle(new Vector(0, 0), new Vector(10, 10));
      expect(rect1.intersectsRectangle(rect3)).toBe(true);
    });

    test('should handle contained rectangles', () => {
      const smallRect = new Rectangle(new Vector(2, 2), new Vector(6, 6));
      const largeRect = new Rectangle(new Vector(-5, -5), new Vector(20, 20));
      
      expect(rect1.intersectsRectangle(smallRect)).toBe(true); // Small inside rect1
      expect(largeRect.intersectsRectangle(rect1)).toBe(true); // rect1 inside large
    });
  });

  describe('Transformations', () => {
    test('should scale rectangle correctly', () => {
      const rect = new Rectangle(new Vector(0, 0), new Vector(10, 10));
      rect.scale(2);
      
      expect(rect.getSize().x).toBe(20);
      expect(rect.getSize().y).toBe(20);
      expect(rect.getArea()).toBe(400);
    });

    test('should scale rectangle with different X and Y factors', () => {
      const rect = new Rectangle(new Vector(0, 0), new Vector(10, 10));
      rect.scaleXY(2, 3);
      
      expect(rect.getSize().x).toBe(20);
      expect(rect.getSize().y).toBe(30);
      expect(rect.getArea()).toBe(600);
    });

    test('should expand rectangle correctly', () => {
      const rect = new Rectangle(new Vector(5, 5), new Vector(10, 10));
      rect.expand(2);
      
      expect(rect.getPosition().x).toBe(3); // 5 - 2
      expect(rect.getPosition().y).toBe(3); // 5 - 2
      expect(rect.getSize().x).toBe(14); // 10 + 2*2
      expect(rect.getSize().y).toBe(14); // 10 + 2*2
    });

    test('should move rectangle correctly', () => {
      const rect = new Rectangle(new Vector(0, 0), new Vector(10, 10));
      rect.move(new Vector(5, 3));
      
      expect(rect.getPosition().x).toBe(5);
      expect(rect.getPosition().y).toBe(3);
      
      // Corners should move accordingly
      expect(rect.getTopLeft().x).toBe(5);
      expect(rect.getTopLeft().y).toBe(3);
      expect(rect.getBottomRight().x).toBe(15);
      expect(rect.getBottomRight().y).toBe(13);
    });
  });

  describe('Static Factory Methods', () => {
    test('should create rectangle from center', () => {
      const rect = Rectangle.fromCenter(new Vector(10, 10), new Vector(6, 8));
      
      expect(rect.getPosition().x).toBe(7); // 10 - 6/2
      expect(rect.getPosition().y).toBe(6); // 10 - 8/2
      expect(rect.getSize().x).toBe(6);
      expect(rect.getSize().y).toBe(8);
      expect(rect.getAbsCenter().x).toBe(10);
      expect(rect.getAbsCenter().y).toBe(10);
    });

    test('should create rectangle from corners', () => {
      const rect = Rectangle.fromCorners(new Vector(2, 3), new Vector(8, 7));
      
      expect(rect.getPosition().x).toBe(2);
      expect(rect.getPosition().y).toBe(3);
      expect(rect.getSize().x).toBe(6);
      expect(rect.getSize().y).toBe(4);
    });

    test('should create rectangle from corners in any order', () => {
      const rect1 = Rectangle.fromCorners(new Vector(2, 3), new Vector(8, 7));
      const rect2 = Rectangle.fromCorners(new Vector(8, 7), new Vector(2, 3));
      
      expect(rect1.getPosition().x).toBe(rect2.getPosition().x);
      expect(rect1.getPosition().y).toBe(rect2.getPosition().y);
      expect(rect1.getSize().x).toBe(rect2.getSize().x);
      expect(rect1.getSize().y).toBe(rect2.getSize().y);
    });
  });

  describe('Cloning and Equality', () => {
    test('should clone rectangle correctly', () => {
      rect1.setData({ test: 'data' });
      rect1.setCollisionType('custom');
      
      const cloned = rect1.clone();
      
      expect(cloned.getPosition().x).toBe(rect1.getPosition().x);
      expect(cloned.getPosition().y).toBe(rect1.getPosition().y);
      expect(cloned.getSize().x).toBe(rect1.getSize().x);
      expect(cloned.getSize().y).toBe(rect1.getSize().y);
      expect(cloned.getData()).toEqual(rect1.getData());
      expect(cloned.getCollisionType()).toBe(rect1.getCollisionType());
      
      // Should be different instances
      expect(cloned).not.toBe(rect1);
    });

    test('should check equality correctly', () => {
      const rect3 = new Rectangle(new Vector(0, 0), new Vector(10, 10));
      const rect4 = new Rectangle(new Vector(0, 0), new Vector(10, 11));
      
      expect(rect1.equals(rect3)).toBe(true);
      expect(rect1.equals(rect4)).toBe(false);
    });

    test('should check equality with tolerance', () => {
      const rect3 = new Rectangle(new Vector(0.1, 0.1), new Vector(10.1, 10.1));
      
      expect(rect1.equals(rect3, 0.05)).toBe(false);
      expect(rect1.equals(rect3, 0.2)).toBe(true);
    });
  });

  describe('Cache Management', () => {
    test('should clear cache when position changes', () => {
      const initialCenter = rect1.getAbsCenter();
      rect1.move(new Vector(5, 5));
      const newCenter = rect1.getAbsCenter();
      
      expect(newCenter.x).toBe(initialCenter.x + 5);
      expect(newCenter.y).toBe(initialCenter.y + 5);
    });

    test('should clear cache when size changes', () => {
      const initialArea = rect1.getArea();
      rect1.setSize(new Vector(20, 20));
      const newArea = rect1.getArea();
      
      expect(newArea).toBe(400);
      expect(newArea).not.toBe(initialArea);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle zero-sized rectangles', () => {
      const zeroRect = new Rectangle(new Vector(5, 5), new Vector(0, 0));
      
      expect(zeroRect.getArea()).toBe(0);
      expect(zeroRect.getPerimeter()).toBe(0);
      expect(zeroRect.containsPoint(new Vector(5, 5))).toBe(true);
      expect(zeroRect.containsPoint(new Vector(6, 6))).toBe(false);
    });

    test('should handle negative-sized rectangles', () => {
      const negRect = new Rectangle(new Vector(0, 0), new Vector(-10, -10));
      
      expect(negRect.getArea()).toBe(100); // Area is absolute
      expect(negRect.rectWidth).toBe(-10);
      expect(negRect.rectHeight).toBe(-10);
    });

    test('should handle very large rectangles', () => {
      const largeRect = new Rectangle(new Vector(0, 0), new Vector(1000000, 1000000));
      
      expect(largeRect.getArea()).toBe(1000000000000);
      expect(largeRect.containsPoint(new Vector(500000, 500000))).toBe(true);
    });
  });

  describe('String Representation', () => {
    test('should return correct string representation', () => {
      const str = rect1.toString();
      expect(str).toContain('Rectangle');
      expect(str).toContain('0');
      expect(str).toContain('10');
    });
  });

  describe('Performance Tests', () => {
    test('should handle multiple collision checks efficiently', () => {
      const rectangles: Rectangle[] = [];
      
      // Create 100 rectangles
      for (let i = 0; i < 100; i++) {
        rectangles.push(new Rectangle(
          new Vector(Math.random() * 100, Math.random() * 100),
          new Vector(Math.random() * 20 + 5, Math.random() * 20 + 5)
        ));
      }
      
      const start = performance.now();
      
      // Test all pairs for collision
      let collisionCount = 0;
      for (let i = 0; i < rectangles.length; i++) {
        for (let j = i + 1; j < rectangles.length; j++) {
          if (rectangles[i].intersectsRectangle(rectangles[j])) {
            collisionCount++;
          }
        }
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in reasonable time (less than 100ms for 100 rectangles)
      expect(duration).toBeLessThan(100);
      expect(collisionCount).toBeGreaterThanOrEqual(0);
    });
  });
});