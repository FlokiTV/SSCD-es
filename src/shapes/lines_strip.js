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
