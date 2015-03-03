/**
 * Created by Trent on 2/24/2015.
 */

var Game = {};

Game.GameInput = new GameInput();
Game.GameLoop = new GameLoop();
Game.GameTime = new GameTime();
Game.PlayerManager = new PlayerManager();

Game.Batch = new Batch();
Game.Graphics = new Graphics();
Game.Level = new Level();

Game.Physics = new Physics();

window.onload = function() {
    Game.canvas = document.getElementById('render-space');
    Game.canvas.width = document.body.clientWidth;
    Game.canvas.height = document.body.clientHeight;

    Game.Graphics.initGraphics();

    setInterval(Game.GameLoop.tick, 1000 / 60);
};