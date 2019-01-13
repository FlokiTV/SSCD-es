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
