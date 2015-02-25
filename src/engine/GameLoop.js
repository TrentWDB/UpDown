/**
 * Created by Trent on 2/24/2015.
 */

var lastGameTick = new Date().getMilliseconds();

function tick() {
    var newGameTick = new Date().getMilliseconds();
    physicsUpdate(newGameTick - lastGameTick);
    lastGameTick = newGameTick;

    render();
}