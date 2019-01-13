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
