/**
 * Created by Trent on 2/24/2015.
 */

var Game = {};
Game.PlayerManager = new PlayerManager();
Game.GameLoop = new GameLoop();
Game.GameTime = new GameTime();

Game.Batch = new Batch();
Game.Graphics = new Graphics();
Game.Level = new Level();

Game.Physics = new Physics();

window.onload = function() {
    var canvas = document.getElementById('render-space');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    Game.Graphics.initGraphics(canvas);

    setInterval(Game.GameLoop.tick, 1000 / 60);
};