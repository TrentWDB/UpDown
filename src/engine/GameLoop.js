/**
 * Created by Trent on 2/24/2015.
 */

var GameLoop = function() {
    this.tick = function() {
        Game.Physics.update(Game.GameTime.getDeltaTime());

        Game.Graphics.render();
    };
};