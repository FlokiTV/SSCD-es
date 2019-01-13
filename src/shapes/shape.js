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
