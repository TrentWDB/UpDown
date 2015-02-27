/**
 * Created by Trent on 2/24/2015.
 */

var GameLoop = function() {
    this.tick = function() {
        Game.Physics.physicsUpdate(Game.GameTime.getDeltaTime());

        Game.Graphics.render();
    };
};