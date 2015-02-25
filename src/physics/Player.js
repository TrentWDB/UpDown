/**
 * Created by Trent on 2/25/2015.
 */

var Player = function() {
    var player = {};
    player.squareThing = SquareThing();
    player.pos = vec3.create();
    player.vel = vec3.create();
};