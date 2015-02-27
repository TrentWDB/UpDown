/**
 * Created by Trent on 2/25/2015.
 */

var Player = function() {
    this.squareThing = new SquareThing();
    this.pos = vec3.create();
    this.vel = vec3.create();
};