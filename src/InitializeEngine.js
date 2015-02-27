/**
 * Created by Trent on 2/24/2015.
 */

var Game = {};
Game.GameLoop = new GameLoop();
Game.GameTime = new GameTime();

Game.Graphics = new Graphics();

Game.Physics = new Physics();

window.onload = function() {
    var canvas = document.getElementById('render-space');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    Game.Graphics.initGraphics(canvas);

    setInterval(Game.GameLoop.tick, 1000 / 60);
};