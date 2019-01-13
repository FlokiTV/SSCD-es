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
