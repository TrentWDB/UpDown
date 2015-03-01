/**
 * Created by Trent on 2/25/2015.
 */

var Player = function(pos, texturedSquare) {
    this.texturedSquare = texturedSquare;
    this.pos = pos;
    this.vel = vec3.create();
};