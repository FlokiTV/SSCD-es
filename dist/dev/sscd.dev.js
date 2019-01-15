// FILE: license.js

// SSCD (Super Simple Collision Detection) is distributed with the zlib-license:

/* 
  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.

  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.


  Made by Ronen Ness
  ronenness@gmail.com
  
  Modified by CoMiGo Games
  admin@nersta.ru

*/

// FILE: sscd.js

/*
* First file we import, set version and namespace
* Author: Ronen Ness, 2015
*/

// open the namespace
var SSCD = (function() {

// set namespace
var SSCD = SSCD || {};

// version identifier
SSCD.VERSION = 1.5;


// FILE: utils/math.js

/*
 * Some useful Math functions.
 * Author: Ronen Ness, 2015
 */
 
// set namespace
SSCD.Math = {};

// Converts from degrees to radians.
SSCD.Math.to_radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
SSCD.Math.to_degrees = function(radians) {
	return radians * 180 / Math.PI;
};

// get distance between vectors
SSCD.Math.distance = function(p1, p2) {
	var dx = p2.x - p1.x,
		dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
};

// get distance without sqrt
SSCD.Math.dist2 = function(p1, p2) {
	var dx = p2.x - p1.x,
		dy = p2.y - p1.y;
	return (dx * dx + dy * dy);
};

// angle between two vectors
SSCD.Math.angle = function(P1, P2) {
	var deltaY = P2.y - P1.y,
		deltaX = P2.x - P1.x;

	return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
};

// distance from point to line
// p is point to check
// v and w are the two edges of the line segment
SSCD.Math.distance_to_line = function(p, v, w) {

	var l2 = SSCD.Math.dist2(v, w);
	var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
	if (t < 0) {
		return SSCD.Math.distance(p, v);
	}
	if (t > 1) {
		return SSCD.Math.distance(p, w);
	}
	return SSCD.Math.distance(p, {
		x: v.x + t * (w.x - v.x),
		y: v.y + t * (w.y - v.y)
	});
};

// Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
// check if two lines intersect
SSCD.Math.line_intersects = function(p0, p1, p2, p3) {

	var s1_x, s1_y, s2_x, s2_y;
	s1_x = p1.x - p0.x;
	s1_y = p1.y - p0.y;
	s2_x = p3.x - p2.x;
	s2_y = p3.y - p2.y;

	var s, t;
	s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
	t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

	if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
		// Collision detected
		return 1;
	}

	return 0; // No collision
};

// return if point is on given line
SSCD.Math.is_on_line = function(v, l1, l2) {
	return SSCD.Math.distance_to_line(v, l1, l2) <= 5;
};


// return shortest, positive distance between two given angles.
// for example:
//  50, 100 will return 50
//  350, 10 will return 20
// angles shoule be in 0-360 values (but negatives and >360 allowed as well)
SSCD.Math.angles_dis = function(a0, a1) {

	// convert to radians
	a0 = SSCD.Math.to_radians(a0);
	a1 = SSCD.Math.to_radians(a1);

	// get distance
	var max = Math.PI * 2;
	var da = (a1 - a0) % max;
	var distance = 2 * da % max - da;

	// convert back to degrees
	distance = SSCD.Math.to_degrees(distance);

	// return abs value
	return Math.abs(distance);
};

// FILE: utils/vector.js

/*
 * This file define the 2d vector class & utils.
 * Author: Ronen Ness, 2015
 */

// a 2d vector
SSCD.Vector = function(x, y) {
	this.x = x;
	this.y = y;
};


// set vector functions
SSCD.Vector.prototype = {

	// for debug and prints
	get_name: function() {
		return "vector";
	},

	// clone vector
	clone: function() {
		return new SSCD.Vector(this.x, this.y);
	},

	// set value from another vector
	set: function(vector) {
		this.x = vector.x;
		this.y = vector.y;
	},

	// flip between x and y (return without changing self)
	flip: function() {
		return new SSCD.Vector(this.y, this.x);
	},

	// flip between x and y (change self values)
	flip_self: function() {
		this.y = [this.x, this.x = this.y][0];
		return this;
	},

	// make negative (return without changing self)
	negative: function() {
		return this.multiply_scalar(-1);
	},

	// make negative self (multiply by -1)
	negative_self: function() {
		this.multiply_scalar_self(-1);
		return this;
	},

	// get distance from another vector
	distance_from: function(other) {
		return SSCD.Math.distance(this, other);
	},

	// get angle from another vector
	angle_from: function(other) {
		return SSCD.Math.angle(this, other);
	},

	// move the position of this vector (same as add_self)
	move: function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	},

	// normalize this vector
	normalize_self: function() {
		var by = Math.sqrt(this.x * this.x + this.y * this.y);
		if (by === 0) return this;
		this.x /= by;
		this.y /= by;
		return this;
	},

	// return normalized copy (don't change self)
	normalize: function() {
		return this.clone().normalize_self();
	},

	// add vector to self
	add_self: function(other) {
		this.x += other.x;
		this.y += other.y;
		return this;
	},

	// sub vector from self
	sub_self: function(other) {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	},

	// divide vector from self
	divide_self: function(other) {
		this.x /= other.x;
		this.y /= other.y;
		return this;
	},

	// multiple this vector with another
	multiply_self: function(other) {
		this.x *= other.x;
		this.y *= other.y;
		return this;
	},

	// add scalar to self
	add_scalar_self: function(val) {
		this.x += val;
		this.y += val;
		return this;
	},

	// substract scalar from self
	sub_scalar_self: function(val) {
		this.x -= val;
		this.y -= val;
		return this;
	},

	// divide scalar from self
	divide_scalar_self: function(val) {
		this.x /= val;
		this.y /= val;
		return this;
	},

	// multiply scalar from self
	multiply_scalar_self: function(val) {
		this.x *= val;
		this.y *= val;
		return this;
	},

	// add to vector without changing self
	add: function(other) {
		return this.clone().add_self(other);
	},

	// sub from vector without changing self
	sub: function(other) {
		return this.clone().sub_self(other);
	},

	// multiply vector without changing self
	multiply: function(other) {
		return this.clone().multiply_self(other);
	},

	// divide vector without changing self
	divide: function(other) {
		return this.clone().divide_self(other);
	},

	// add scalar without changing self
	add_scalar: function(val) {
		return this.clone().add_scalar_self(val);
	},

	// substract scalar without changing self
	sub_scalar: function(val) {
		return this.clone().sub_scalar_self(val);
	},

	// multiply scalar without changing self
	multiply_scalar: function(val) {
		return this.clone().multiply_scalar_self(val);
	},

	// divide scalar without changing self
	divide_scalar: function(val) {
		return this.clone().divide_scalar_self(val);
	},

	// clamp vector values
	clamp: function(min, max) {
		if (this.x < min) this.x = min;
		if (this.y < min) this.y = min;
		if (this.x > max) this.x = max;
		if (this.y > max) this.y = max;
		return this;
	},

	// create vector from radian
	from_radian: function(rad) {
		this.x = Math.cos(rad);
		this.y = Math.sin(rad);
		return this;
	},

	// create vector from radian
	from_angle: function(angle) {
		return this.from_radian(SSCD.Math.to_radians(angle));
	},
	
	// apply a function on x and y components on self
	apply_self: function(func) {
		this.x = func(this.x);
		this.y = func(this.y);
		return this;
	},

	// apply a function on x and y components
	apply: function(func) {
		return this.clone().apply_self(func);
	},

	// print debug
	debug: function() {
		console.debug(this.x + ", " + this.y);
	}
};

SSCD.Vector.ZERO = new SSCD.Vector(0, 0);
SSCD.Vector.ONE = new SSCD.Vector(1, 1);
SSCD.Vector.UP = new SSCD.Vector(0, -1);
SSCD.Vector.DOWN = new SSCD.Vector(0, 1);
SSCD.Vector.LEFT = new SSCD.Vector(-1, 0);
SSCD.Vector.RIGHT = new SSCD.Vector(1, 0);
SSCD.Vector.UP_LEFT = new SSCD.Vector(-1, -1);
SSCD.Vector.DOWN_LEFT = new SSCD.Vector(-1, 1);
SSCD.Vector.UP_RIGHT = new SSCD.Vector(1, -1);
SSCD.Vector.DOWN_RIGHT = new SSCD.Vector(1, 1);

// FILE: utils/extend.js

/*
 * Provide simple inheritance (extend prototype)
 * Author: Ronen Ness, 2015
 */

// inherit base into child
// base / child must be object's prototype (eg SSCD.something.prototype)
// NOTE: don't use javascript built-ins so you won't mess up their prototypes.
SSCD.extend = function(base, child) {

	// copy all properties
	for (var prop in base) {
		if (child[prop])
			continue;

		child[prop] = base[prop];
	}

	// create inits list (constructors)
	// this creates a function namd .init() that will call all the __init__() functions in the inheritance chain by the order it was extended.
	child.__inits = child.__inits || [];

	// add parent init function
	if (base.__init__) {
		child.__inits.push(base.__init__);
	}

	// set init function
	child.init = function() {
		for (var i = 0; i < this.__inits.length; ++i) {
			this.__curr_init_func = this.__inits[i];
			this.__curr_init_func();
		}
		delete this.__curr_init_func;
	};
};

// for not-implemented exceptions
SSCD.NotImplementedError = function(message) {
	this.name = "NotImplementedError";
	this.message = (message || "");
};
SSCD.NotImplementedError.prototype = Error.prototype;

// FILE: utils/aabb.js

/*
 * Define axis-aligned-bounding-box class.
 * Author: Ronen Ness, 2015
 */

// Axis-aligned-bounding-box class
// position: top-left corner (vector)
// size: width and height (vector)
SSCD.AABB = function(position, size) {
	this.position = position.clone();
	this.size = size.clone();
};

// some aabb methods
SSCD.AABB.prototype = {

	// expand this bounding-box by other bounding box
	expand: function(other) {
		// get new bounds
		var min_x = Math.min(this.position.x, other.position.x);
		var min_y = Math.min(this.position.y, other.position.y);
		var max_x = Math.max(this.position.x + this.size.x, other.position.x + other.size.x);
		var max_y = Math.max(this.position.y + this.size.y, other.position.y + other.size.y);

		// set them
		this.position.x = min_x;
		this.position.y = min_y;
		this.size.x = max_x - min_x;
		this.size.y = max_y - min_y;
	},

	// expand this bounding-box with vector
	add_vector: function(vector) {
		// update position x
		var push_pos_x = this.position.x - vector.x;
		if (push_pos_x > 0) {
			this.position.x -= push_pos_x;
			this.size.x += push_pos_x;
		}

		// update position y
		var push_pos_y = this.position.y - vector.y;
		if (push_pos_y > 0) {
			this.position.y -= push_pos_y;
			this.size.y += push_pos_y;
		}

		// update size x
		var push_size_x = vector.x - (this.position.x + this.size.x);
		if (push_size_x > 0) {
			this.size.x += push_size_x;
		}

		// update size y
		var push_size_y = vector.y - (this.position.y + this.size.y);
		if (push_size_y > 0) {
			this.size.y += push_size_y;
		}
	},

	// clone this aabb
	clone: function() {
		return new SSCD.AABB(this.position, this.size);
	}

};

// FILE: shapes/shape.js

/*
 * define the base class of any collision shape.
 * every type of shape should inherit from this class.
 * Author: Ronen Ness, 2015
 */

// base shape class
SSCD.Shape = function() {};

// base shape prototype
SSCD.Shape.prototype = {

    // shape type (need to be overrided by children)
    __type: 'shape',

    // define the collision type of this shape (how collision is tested against it)
    __collision_type: null,

    // to detect if this object is a collision shape
    is_shape: true,

    // optional data or object you can attach to shapes
    __data: null,

    // to give unique id to every shape for internal usage
    __next_id: 0,

    // init the general shape
    __init__() {
        // create position and set default type
        this.__position = new SSCD.Vector();
    },

    // check collision with other object
    // @param obj - any other shape or vector.
    test_collide_with(obj) {
        return SSCD.CollisionManager.test_collision(this, obj);
    },

    // repeal an object from this object.
    // this means, in simple words, we push the other object outside to prevent penetration.
    // this works in a very simply way - it iterates and push the penetrating object outside from center until its no longer collided.
    // @param obj: object or vector to repeal (must have move() function).
    // @param force: force factor, the bigger this is the stronger / faster the repealing will be. default to 1.
    // @param iterations: max iterations of repeal-and-test-again routines. default to 1.
    // @param factor_self: factor to multiply force that will apply on this shape. default to 0.
    // @param factor_other: factor to multiply force that will apply on this shape. default to 1.
    // NOTE: this function assume there's collision on start, meaning first iteration of repeal will ALWAYS happen.
    // @return: total movement due to repeling (vector).
    repel(obj, force, iterations, factor_self, factor_other) {
        // set defaults
        force = force || 1;
        iterations = iterations || 1;
        if (factor_self === void 0) {factor_self = 0;}
        if (factor_other === void 0) {factor_other = 1;}

        // get push vectors
        var push_vector_other, push_vector_self;
        var push_vector = this.get_repel_direction(obj).multiply_scalar_self(force);
        if (factor_other) { push_vector_other = push_vector.multiply_scalar(factor_other);}
        if (factor_self) { push_vector_self = push_vector.multiply_scalar(factor_self * -1);}

        // for return value
        var ret = SSCD.Vector.ZERO.clone();

        // now do the repeling
        var collide = true;
        while (collide && iterations > 0) {
            // decreate iterations count
            iterations--;

            // do pushing
            if (push_vector_other) { obj.move(push_vector_other); }
            if (push_vector_self) { this.move(push_vector_self); }
            ret.add_self(push_vector);

            // check if still colliding
            collide = this.test_collide_with(obj);
        }

        // return total pushed
        return ret;
    },

    // get repel direction between this shape and another shape / vector.
    get_repel_direction(obj) {
        // get the center of this object
        var center = this.get_abs_center();

        // get center of other object / vector
        var other_center;
        if (obj instanceof SSCD.Vector) {
            other_center = obj;
        } else {
            other_center = obj.get_abs_center();
        }

        // return repel direction vector
        return other_center.sub(center).normalize_self();
    },

    // attach data/object to this shape.
    // @param obj - anything you want to attach to this shape.
    set_data(obj) {
        this.__data = obj;
        return this;
    },

    // return the attached data / object of this shape.
    get_data() {
        return this.__data;
    },

    // return shape type.
    get_name() {
        return this.__type;
    },

    // set the current position of this shape.
    // @param vector - new position.
    set_position(vector) {
        this.__position.x = vector.x;
        this.__position.y = vector.y;
        this.__update_position();
        return this;
    },

    // get position (return vector).
    get_position() {
        return this.__position.clone();
    },

    // move the shape from its current position.
    // @param vector - vector to move the shape.
    move(vector) {
        this.set_position(this.__position.add(vector));
        return this;
    },

    // should be called whenever position changes.
    __update_position() {
        // call position-change hook
        if (this.__update_position_hook) {
            this.__update_position_hook();
        }

        // remove bounding box cache
        if (this.__aabb) {
            this.__update_aabb_pos();
        }
    },

    // called to update axis-aligned-bounding-box position.
    // this function called AFTER the position update, meaning new position applied.
    // this function only called if have aabb in cache.
    __update_aabb_pos() {
        this.__aabb.position = this.__position;
    },

    // return the absolute center of the shape.
    get_abs_center() {
        var aabb = this.get_aabb();
        return aabb.position.add(aabb.size.multiply_scalar(0.5));
    },

    // reset bounding box.
    reset_aabb() {
        this.__aabb = void 0;
    },

    // optional hook you can override that will be called whenever shape position changes.
    __update_position_hook: null,

    // build the shape's axis-aligned bounding box.
    build_aabb() {
        throw new SSCD.NotImplementedError();
    },

    // return the axis-aligned-bounding-box of this shape.
    get_aabb() {
        this.__aabb = this.__aabb || this.build_aabb();
        return this.__aabb;
    },

};


// FILE: shapes/circle.js

/*
 * A circle collision shape
 * Author: Ronen Ness, 2015
 */
 
// define the circle shape
// @param position - center position (vector)
// @param radius - circle radius (integer)
SSCD.Circle = function(position, radius) {
    // call init chain
    this.init();

    // set radius and size
    this.__radius = radius;
    this.__size = new SSCD.Vector(radius, radius).multiply_scalar_self(2);

    // set starting position
    this.set_position(position);
};

// Circle prototype
SSCD.Circle.prototype = {

    // set type and collision type
    __type: 'circle',
    __collision_type: 'circle',

    // return circle radius
    get_radius() {
        return this.__radius;
    },

    // called to update axis-aligned-bounding-box position
    __update_aabb_pos() {
        this.__aabb.position = this.__position.sub_scalar(this.__radius);
    },

    // return axis-aligned-bounding-box
    build_aabb() {
        return new SSCD.AABB(this.__position.sub_scalar(this.__radius), this.__size);
    },

    // return the absolute center of the shape
    get_abs_center() {
        return this.__position.clone();
    },

};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.Circle.prototype);


// FILE: shapes/rectangle.js

/*
 * rectangle collision shape
 * Author: Ronen Ness, 2015
 */
 
// define the rectangle shape
// @param position - starting position (vector)
// @param size - rectangle size (vector)
SSCD.Rectangle = function(position, size) {
    // call init chain
    this.init();

    // set radius and size
    this.__size = size;

    // set starting position
    this.set_position(position);
};

// rectangle prototype
SSCD.Rectangle.prototype = {

    // set type and collision type
    __type: 'rectangle',
    __collision_type: 'rectangle',

    // return rectangle size
    get_size() {
        return this.__size.clone();
    },

    // return axis-aligned-bounding-box
    build_aabb() {
        return new SSCD.AABB(this.__position, this.__size);
    },

    // return absolute top-left corner
    get_top_left() {
        this.__top_left_c = this.__top_left_c || this.__position.clone();
        return this.__top_left_c;
    },

    // return absolute bottom-left corner
    get_bottom_left() {
        this.__bottom_left_c = this.__bottom_left_c || this.__position.add(new SSCD.Vector(0, this.__size.y));
        return this.__bottom_left_c;
    },

    // return absolute top-right corner
    get_top_right() {
        this.__top_right_c = this.__top_right_c || this.__position.add(new SSCD.Vector(this.__size.x, 0));
        return this.__top_right_c;
    },

    // return absolute bottom-right corner
    get_bottom_right() {
        this.__bottom_right_c = this.__bottom_right_c || this.__position.add(new SSCD.Vector(this.__size.x, this.__size.y));
        return this.__bottom_right_c;
    },

    // return absolute center
    get_abs_center() {
        this.__abs_center_c = this.__abs_center_c || this.__position.add(this.__size.divide_scalar(2));
        return this.__abs_center_c;
    },

    // on position change
    __update_position_hook() {
        // clear corner cache
        this.__top_left_c = void 0;
        this.__top_right_c = void 0;
        this.__bottom_left_c = void 0;
        this.__bottom_right_c = void 0;
        this.__abs_center_c = void 0;
    },

};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.Rectangle.prototype);


// FILE: shapes/line.js

/*
 * A line collision shape
 * Author: Ronen Ness, 2015
 */
 
// define the line shape
// @param source - starting position (vector)
// @param dest - destination point from source (vector)
// output line will be from source to dest, and when you move it you will actually move the source position.
SSCD.Line = function(source, dest) {
    // call init chain
    this.init();

    // set dest position
    this.__dest = dest;

    // set starting position
    this.set_position(source);
};

// Line prototype
SSCD.Line.prototype = {

    // set type and collision type
    __type: 'line',
    __collision_type: 'line',

    // return axis-aligned-bounding-box
    build_aabb() {
        var pos = new SSCD.Vector(0, 0);
        pos.x = this.__dest.x > 0 ? this.__position.x : this.__position.x + this.__dest.x;
        pos.y = this.__dest.y > 0 ? this.__position.y : this.__position.y + this.__dest.y;
        var size = this.__dest.apply(Math.abs);
        return new SSCD.AABB(pos, size);
    },

    // return absolute first point
    get_p1() {
        this.__p1_c = this.__p1_c || this.__position.clone();
        return this.__p1_c;
    },

    // return absolute second point
    get_p2() {
        this.__p2_c = this.__p2_c || this.__position.add(this.__dest);
        return this.__p2_c;
    },

    // on position change
    __update_position_hook() {
        // clear points cache
        this.__p1_c = void 0;
        this.__p2_c = void 0;
    },

};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.Line.prototype);


// FILE: shapes/lines_strip.js

/*
 * A strip-of-lines collision shape
 * Author: Ronen Ness, 2015
 */
 
// define the line shape
// @param position - starting position (vector)
// @param points - list of vectors that will make the lines.
// @param closed - if true, will create a line between last and first points. default to false.
SSCD.LineStrip = function(position, points, closed) {
    // call init chain
    this.init();

    // set points
    this.__points = points;

    // if not enough points assert
    if (points.length <= 1) {
        throw new SSCD.IllegalActionError('Not enough vectors for LineStrip (got to have at least two vectors)');
    }

    // close shape
    if (closed) {
        this.__points.push(this.__points[0]);
    }

    // set starting position
    this.set_position(position);
};

// line-strip prototype
SSCD.LineStrip.prototype = {

    // set type and collision type
    __type: 'line-strip',
    __collision_type: 'line-strip',

    // return line list with absolute positions
    get_abs_lines() {
        // if got lines in cache return it
        if (this.__abs_lines_c) {
            return this.__abs_lines_c;
        }

        // create list of lines
        var points = this.get_abs_points();
        var ret = [];
        for (var i = 0; i < points.length - 1; i++) {
            ret.push([points[i], points[i + 1]]);
        }

        // add to cache and return
        this.__abs_lines_c = ret;
        return ret;
    },

    // return points with absolute position
    get_abs_points() {
        // if got points in cache return it
        if (this.__abs_points_c) {
            return this.__abs_points_c;
        }

        // convert points
        var ret = [];
        for (var i = 0; i < this.__points.length; i++) {
            ret.push(this.__points[i].add(this.__position));
        }

        // add to cache and return
        this.__abs_points_c = ret;
        return ret;
    },

    // on position change
    __update_position_hook() {
        // clear points and lines cache
        this.__abs_points_c = void 0;
        this.__abs_lines_c = void 0;
    },

    // called to update axis-aligned-bounding-box position
    __update_aabb_pos() {
        this.__aabb.position.set(this.__aabb_offset_c.add(this.__position));
    },

    // return axis-aligned-bounding-box
    build_aabb() {
        var ret = new SSCD.AABB(SSCD.Vector.ZERO, SSCD.Vector.ZERO);
        for (var i = 0; i < this.__points.length; ++i) {
            ret.add_vector(this.__points[i]);
        }
        this.__aabb_offset_c = ret.position.clone();
        ret.position.add_self(this.__position);
        return ret;
    },

};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.LineStrip.prototype);


// FILE: shapes/composite_shape.js

/*
 * a special shape made from multiple shapes combined together
 * Author: Ronen Ness, 2015
 */
 
// create a composite shape
// @param position - optional starting position (vector)
// @param objects - optional list of collision objects to start with
SSCD.CompositeShape = function(position, objects) {
    // call init chain
    this.init();
    this.__init_comp_shape(position, objects);
};

// composite shape prototype
SSCD.CompositeShape.prototype = {

    // set type and collision type
    __type: 'composite-shape',
    __collision_type: 'composite-shape',

    // init the composite shape.
    // @param position - source position.
    // @param objects - list of starting objects.
    __init_comp_shape(position, objects) {
        // create empty list of shapes
        this.__shapes = [];

        // default position
        position = position || SSCD.Vector.ZERO;
        this.set_position(position);

        // add objects if provided
        if (objects) {
            for (var i = 0; i < objects.length; ++i) {
                this.add(objects[i]);
            }
        }
    },

    // repeal an object from this object.
    // here we iterate over sub-object and repeal only from the ones we collide with.
    // read base shape repel() doc for more info.
    repel(obj, force, iterations, factor_self, factor_other) {
        // do repel from independant shapes inside this composite shape
        var ret = SSCD.Vector.ZERO.clone();
        for (var i = 0; i < this.__shapes.length; ++i) {
            var shape = this.__shapes[i].shape;
            if (shape.test_collide_with(obj)) {
                ret.add_self(shape.repel(obj, force, iterations, 0, factor_other));
            }
        }

        // if have factor to move self, apply it
        if ((factor_self || 0) !== 0) {
            this.move(ret.multiply_scalar(factor_self * -1));
        }

        // return factor
        return ret;
    },

    // get shapes list.
    get_shapes() {
        // if already got shapes list in cache return it
        if (this.__shapes_list_c) {
            return this.__shapes_list_c;
        }

        // create shapes list
        var ret = [];
        for (var i = 0; i < this.__shapes.length; ++i) {
            ret.push(this.__shapes[i].shape);
        }

        // add to cache and return
        this.__shapes_list_c = ret;
        return ret;
    },

    // return axis-aligned-bounding-box.
    build_aabb() {
        // if no shapes return zero aabb
        if (this.__shapes.length === 0) {
            this.__aabb_pos_offset_c = SSCD.Vector.ZERO;
            return new SSCD.AABB(SSCD.Vector.ZERO, SSCD.Vector.ZERO);
        }

        // return combined aabb
        var ret = null;
        for (var i = 0; i < this.__shapes.length; ++i) {
            var curr_aabb = this.__shapes[i].shape.get_aabb();
            if (ret) {
                ret.expand(curr_aabb);
            } else {
                ret = curr_aabb;
            }
        }

        // store diff between position and bounding-box position, for faster aabb movement
        this.__aabb_pos_offset_c = ret.position.sub(this.__position);

        // return bounding-box
        return ret;
    },

    // called to update axis-aligned-bounding-box position.
    __update_aabb_pos() {
        this.__aabb.position = this.__position.add(this.__aabb_pos_offset_c);
    },

    // add shape to the composite shape.
    // @param shape - the shape to add.
    add(shape) {
        // store shape offset
        var offset = shape.__position;

        // reset shapes list cache
        this.__shapes_list_c = void 0;

        // add shape to list of shapes and fix position
        this.__shapes.push({
            shape: shape,
            offset: offset.clone()
        });
        shape.set_position(this.__position.add(offset));

        // reset bounding-box
        this.reset_aabb();

        // set shape tags to be the composite shape tags
        shape.__collision_tags_val = this.__collision_tags_val;
        shape.__collision_tags = this.__collision_tags;

        // set shape debug colors
        shape.__override_fill_color = this.__override_fill_color;
        shape.__override_stroke_color = this.__override_stroke_color;

        // return the newly added shape
        return shape;
    },

    // hook to call when update tags - update all child objects with new tags.
    __update_tags_hook() {
        // update all shapes about the new tags
        for (var i = 0; i < this.__shapes; ++i) {
            var shape = this.__shapes[i].shape;
            shape.__collision_tags_val = this.__collision_tags_val;
            shape.__collision_tags = this.__collision_tags;
        }
    },

    // remove a shape.
    remove(shape) {
        this.__shapes_list_c = void 0;
        for (var i = 0; i < this.__shapes.length; ++i) {
            if (this.__shapes[i].shape === shape) {
                this.__shapes.splice(i, 1);
                return;
            }
        }

        throw new SSCD.IllegalActionError("Shape to remove is not in composite shape!");
    },

    // on position change - update all shapes.
    __update_position_hook() {
        for (var i = 0; i < this.__shapes.length; ++i) {
            this.__shapes[i].shape.set_position(this.__position.add(this.__shapes[i].offset));
        }
    }
};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.CompositeShape.prototype);


// FILE: shapes/capsule.js

/*
 * a special shape made from multiple shapes combined together
 * Author: Ronen Ness, 2015
 */
 
// create a capsule shape. implemented by a composite-shape with two circles and a rectangle.
// @param position - optional starting position (vector)
// @param size - size in pixels (vector)
// @param standing - if true, capsule will be standing. else, will lie down. (default: true)
SSCD.Capsule = function(position, size, standing) {
	// call init chain
	this.init();

	// default standing
	if (standing === void 0) standing = true;

	// create objects
	objects = [];
	if (standing) {
		size = size.clone();
		size.y -= size.x;
		objects.push(new SSCD.Rectangle(new SSCD.Vector(-size.x * 0.5, -size.y * 0.5), size));
		objects.push(new SSCD.Circle(new SSCD.Vector(0, -size.y * 0.5), size.x * 0.5));
		objects.push(new SSCD.Circle(new SSCD.Vector(0, size.y * 0.5), size.x * 0.5));
	} else {
		size = size.clone();
		size.y -= size.x;
		objects.push(new SSCD.Rectangle(new SSCD.Vector(-size.y * 0.5, -size.x * 0.5), size.flip()));
		objects.push(new SSCD.Circle(new SSCD.Vector(-size.y * 0.5, 0), size.x * 0.5));
		objects.push(new SSCD.Circle(new SSCD.Vector(size.y * 0.5, 0), size.x * 0.5));
	}

	// init composite shape
	this.__init_comp_shape(position, objects);
};

// Capsule prototype
SSCD.Capsule.prototype = {

	__type: "capsule",

};

// inherit from CompositeShape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.CompositeShape.prototype, SSCD.Capsule.prototype);

// FILE: shapes/shapes_collider.js

/*
 * here we define all the collision-detection functions for all possible shape combinations
 * Author: Ronen Ness, 2015
 */

SSCD.CollisionManager = {

    // test collision between two objects, a and b.
    // @param a, b - instances to check collision. can be any shape or vector.
    test_collision(a, b) {
        // vector-vector collision
        if (a instanceof SSCD.Vector && b instanceof SSCD.Vector) {
            return this._test_collision_vector_vector(a, b);
        }

        // composite shape collision
        if (a.__collision_type == 'composite-shape') {
            return this._test_collision_composite_shape(a, b);
        }
        if (b.__collision_type == 'composite-shape') {
            return this._test_collision_composite_shape(b, a);
        }

        // circle-vector collision
        if (a instanceof SSCD.Vector && b.__collision_type == 'circle') {
            return this._test_collision_circle_vector(b, a);
        }
        if (a.__collision_type == 'circle' && b instanceof SSCD.Vector) {
            return this._test_collision_circle_vector(a, b);
        }

        // circle-circle collision
        if (a.__collision_type == 'circle' && b.__collision_type == 'circle') {
            return this._test_collision_circle_circle(b, a);
        }

        // circle-rectangle collision
        if (a.__collision_type == 'circle' && b.__collision_type == 'rectangle') {
            return this._test_collision_circle_rect(a, b);
        }
        if (a.__collision_type == 'rectangle' && b.__collision_type == 'circle') {
            return this._test_collision_circle_rect(b, a);
        }

        // circle-line collision
        if (a.__collision_type == 'circle' && b.__collision_type == 'line') {
            return this._test_collision_circle_line(a, b);
        }
        if (a.__collision_type == 'line' && b.__collision_type == 'circle') {
            return this._test_collision_circle_line(b, a);
        }

        // linestrip-line collision
        if (a.__collision_type == 'line-strip' && b.__collision_type == 'line') {
            return this._test_collision_linestrip_line(a, b);
        }
        if (a.__collision_type == 'line' && b.__collision_type == 'line-strip') {
            return this._test_collision_linestrip_line(b, a);
        }

        // circle-linestrip collision
        if (a.__collision_type == 'circle' && b.__collision_type == 'line-strip') {
            return this._test_collision_circle_linestrip(a, b);
        }
        if (a.__collision_type == 'line-strip' && b.__collision_type == 'circle') {
            return this._test_collision_circle_linestrip(b, a);
        }

        // rect-vector collision
        if (a instanceof SSCD.Vector && b.__collision_type == 'rectangle') {
            return this._test_collision_rect_vector(b, a);
        }
        if (a.__collision_type == 'rectangle' && b instanceof SSCD.Vector) {
            return this._test_collision_rect_vector(a, b);
        }

        // rect-rect collision
        if (a.__collision_type == 'rectangle' && b.__collision_type == 'rectangle') {
            return this._test_collision_rect_rect(b, a);
        }

        // line-strip with line-strip collision
        if (a.__collision_type == 'line-strip' && b.__collision_type == 'line-strip') {
            return this._test_collision_linestrip_linestrip(a, b);
        }

        // rect-line collision
        if (a.__collision_type == 'line' && b.__collision_type == 'rectangle') {
            return this._test_collision_rect_line(b, a);
        }
        if (a.__collision_type == 'rectangle' && b.__collision_type == 'line') {
            return this._test_collision_rect_line(a, b);
        }

        // rect-linestrip collision
        if (a.__collision_type == 'line-strip' && b.__collision_type == 'rectangle') {
            return this._test_collision_rect_linestrip(b, a);
        }
        if (a.__collision_type == 'rectangle' && b.__collision_type == 'line-strip') {
            return this._test_collision_rect_linestrip(a, b);
        }

        // line-line collision
        if (a.__collision_type == 'line' && b.__collision_type == 'line') {
            return this._test_collision_line_line(a, b);
        }

        // vector-line collision
        if (a.__collision_type == 'line' && b instanceof SSCD.Vector) {
            return this._test_collision_vector_line(b, a);
        }
        if (a instanceof SSCD.Vector && b.__collision_type == 'line') {
            return this._test_collision_vector_line(a, b);
        }

        // vector-linestrip collision
        if (a.__collision_type == 'line-strip' && b instanceof SSCD.Vector) {
            return this._test_collision_vector_linestrip(b, a);
        }
        if (a instanceof SSCD.Vector && b.__collision_type == 'line-strip') {
            return this._test_collision_vector_linestrip(a, b);
        }

        // unsupported shapes!
        throw new SSCD.UnsupportedShapes(a, b);
    },

    // test collision between two vectors
    _test_collision_vector_vector(a, b) {
        return (a.x === b.x) && (a.y === b.y);
    },

    // test collision between circle and vector
    _test_collision_circle_vector(circle, vector) {
        return SSCD.Math.distance(circle.__position, vector) <= circle.__radius;
    },

    // test collision between circle and another circle
    _test_collision_circle_circle(a, b) {
        return SSCD.Math.distance(a.__position, b.__position) <= a.__radius + b.__radius;
    },

    // test collision between rectangle and vector
    _test_collision_rect_vector(rect, vector) {
        return (vector.x >= rect.__position.x) && (vector.y >= rect.__position.y) &&
            (vector.x <= rect.__position.x + rect.__size.x) &&
            (vector.y <= rect.__position.y + rect.__size.y);
    },

    // test collision vector with line
    _test_collision_vector_line(v, line) {
        return SSCD.Math.is_on_line(v, line.get_p1(), line.get_p2());
    },

    // test collision vector with linestrip
    _test_collision_vector_linestrip(v, linestrip) {
        var lines = linestrip.get_abs_lines();
        for (var i = 0; i < lines.length; ++i) {
            if (SSCD.Math.is_on_line(v, lines[i][0], lines[i][1])) {
                return true;
            }
        }
        return false;
    },

    // test collision between circle and line
    _test_collision_circle_line(circle, line) {
        return SSCD.Math.distance_to_line(circle.__position, line.get_p1(), line.get_p2()) <= circle.__radius;
    },

    // test collision between circle and line-strip
    _test_collision_circle_linestrip(circle, linestrip) {
        var lines = linestrip.get_abs_lines();
        for (var i = 0; i < lines.length; ++i) {
            if (SSCD.Math.distance_to_line(circle.__position, lines[i][0], lines[i][1]) <= circle.__radius) {
                return true;
            }
        }
        return false;
    },

    // test collision between linestrip and a single line
    _test_collision_linestrip_line(linestrip, line) {
        var lines = linestrip.get_abs_lines();
        var p1 = line.get_p1(),
            p2 = line.get_p2();
        for (var i = 0; i < lines.length; ++i) {
            if (SSCD.Math.line_intersects(p1, p2, lines[i][0], lines[i][1])) {
                return true;
            }
        }
        return false;
    },

    // check collision line with line
    _test_collision_line_line(a, b) {
        return SSCD.Math.line_intersects(a.get_p1(), a.get_p2(),
            b.get_p1(), b.get_p2());
    },

    // check collision between rectangle and line
    _test_collision_rect_line(rect, line) {
        // get the line's two points
        var p1 = line.get_p1();
        var p2 = line.get_p2();

        // first check if one of the line points is contained inside the rectangle
        if (SSCD.CollisionManager._test_collision_rect_vector(rect, p1) ||
            SSCD.CollisionManager._test_collision_rect_vector(rect, p2)) {
            return true;
        }

        // now check collision between line and rect lines

        // left side
        var r1 = rect.get_top_left();
        var r2 = rect.get_bottom_left();
        if (SSCD.Math.line_intersects(p1, p2, r1, r2)) {
            return true;
        }

        // right side
        var r3 = rect.get_top_right();
        var r4 = rect.get_bottom_right();
        if (SSCD.Math.line_intersects(p1, p2, r3, r4)) {
            return true;
        }

        // top side
        if (SSCD.Math.line_intersects(p1, p2, r1, r3)) {
            return true;
        }

        // bottom side
        if (SSCD.Math.line_intersects(p1, p2, r2, r4)) {
            return true;
        }

        // no collision
        return false;
    },

    // test collision between rectagnle and linesstrip
    _test_collision_rect_linestrip(rect, linesstrip) {
        // first check all points
        var points = linesstrip.get_abs_points();
        for (var i = 0; i < points.length; ++i) {
            if (this._test_collision_rect_vector(rect, points[i])) {
                return true;
            }
        }

        // now check intersection with rectangle sides

        var r1 = rect.get_top_left();
        var r2 = rect.get_bottom_left();
        var r3 = rect.get_top_right();
        var r4 = rect.get_bottom_right();

        var lines = linesstrip.get_abs_lines();
        for (var i = 0; i < lines.length; ++i) {
            var p1 = lines[i][0];
            var p2 = lines[i][1];

            // left side
            if (SSCD.Math.line_intersects(p1, p2, r1, r2)) {
                return true;
            }

            // right side
            if (SSCD.Math.line_intersects(p1, p2, r3, r4)) {
                return true;
            }

            // top side
            if (SSCD.Math.line_intersects(p1, p2, r1, r3)) {
                return true;
            }

            // bottom side
            if (SSCD.Math.line_intersects(p1, p2, r2, r4)) {
                return true;
            }
        }

        // no collision
        return false;
    },

    // test collision between two linestrips
    _test_collision_linestrip_linestrip(strip1, strip2) {
        var lines1 = strip1.get_abs_lines();
        var lines2 = strip2.get_abs_lines();
        for (var i = 0; i < lines1.length; ++i) {
            for (var j = 0; j < lines2.length; ++j) {
                if (SSCD.Math.line_intersects(lines1[i][0], lines1[i][1],
                        lines2[j][0], lines2[j][1])) {
                    return true;
                }
            }
        }
        return false;
    },

    // test composite shape with any other shape
    _test_collision_composite_shape(composite, other) {
        // get all shapes in composite shape
        var comp_shapes = composite.get_shapes();

        // special case: other shape is a composite shape as well
        if (other.__collision_type == 'composite-shape') {
            var other_shapes = other.get_shapes();
            for (var i = 0; i < comp_shapes.length; ++i) {
                for (var j = 0; j < other_shapes.length; ++j) {
                    if (SSCD.CollisionManager.test_collision(comp_shapes[i], other_shapes[j])) {
                        return true;
                    }
                }
            }
        }
        // normal case - other shape is a normal shape
        else {
            for (var i = 0; i < comp_shapes.length; ++i) {
                if (SSCD.CollisionManager.test_collision(comp_shapes[i], other)) {
                    return true;
                }
            }
        }

        // no collision found
        return false;

    },

    // test collision between circle and rectangle
    _test_collision_circle_rect(circle, rect) {
        // get circle center
        var circle_pos = circle.__position;

        // first check if circle center is inside the rectangle - easy case
        var collide = SSCD.CollisionManager._test_collision_rect_vector(rect, circle_pos);
        if (collide) {
            return true;
        }

        // get rectangle center
        var rect_center = rect.get_abs_center();

        // now check other simple case - collision between rect center and circle
        var collide = SSCD.CollisionManager._test_collision_circle_vector(circle, rect_center);
        if (collide) {
            return true;
        }

        // create a list of lines to check (in the rectangle) based on circle position to rect center
        var lines = [];
        if (rect_center.x > circle_pos.x) {
            lines.push([rect.get_top_left(), rect.get_bottom_left()]);
        } else {
            lines.push([rect.get_top_right(), rect.get_bottom_right()]);
        }
        if (rect_center.y > circle_pos.y) {
            lines.push([rect.get_top_left(), rect.get_top_right()]);
        } else {
            lines.push([rect.get_bottom_left(), rect.get_bottom_right()]);
        }

        // now check intersection between circle and each of the rectangle lines
        for (var i = 0; i < lines.length; ++i) {
            var dist_to_line = SSCD.Math.distance_to_line(circle_pos, lines[i][0], lines[i][1]);
            if (dist_to_line <= circle.__radius) {
                return true;
            }
        }

        // no collision..
        return false;
    },

    // test collision between circle and rectangle
    _test_collision_rect_rect(a, b) {
        var r1 = {
            left: a.__position.x,
            right: a.__position.x + a.__size.x,
            top: a.__position.y,
            bottom: a.__position.y + a.__size.y
        };
        var r2 = {
            left: b.__position.x,
            right: b.__position.x + b.__size.x,
            top: b.__position.y,
            bottom: b.__position.y + b.__size.y
        };
        return !(r2.left >= r1.right ||
            r2.right <= r1.left ||
            r2.top >= r1.bottom ||
            r2.bottom <= r1.top);
    },
};

// exception when trying to check collision on shapes not supported
SSCD.UnsupportedShapes = function(a, b) {
    this.name = 'Unsupported Shapes';
    this.message = 'Unsupported shapes collision test! \'' + a.get_name() + '\' <-> \'' + b.get_name() + '\'.';
};
SSCD.UnsupportedShapes.prototype = Error.prototype;


// FILE: sscd_close.js


// close the whole namespace

return SSCD;
})();

// FILE: packages/npm.js

/*
* This file is just to make this package npm compliant.
* Author: Ronen Ness, 2015
*/

if (typeof exports !== "undefined")
{
	exports.sscd = SSCD;
}

