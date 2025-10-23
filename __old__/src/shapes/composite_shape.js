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
