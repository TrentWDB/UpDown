/**
 * Created by Trent on 2/27/2015.
 */

var Level = function() {
    this.aestheticTexturedSquares = [];
    this.collidableTexturedSquares = [];

    this.createLevel = function() {
        var frontWallTexCoords = [
            0, 0,
            10, 0,
            10, 10,
            0, 10
        ];
        var frontWall = new TexturedSquare(vec3.fromValues(0, 0, 0), vec2.fromValues(1920, 1920), frontWallTexCoords, Game.Graphics.wallTexture);
        this.aestheticTexturedSquares.push(frontWall);
    };

    this.render = function() {
        for (var i = 0; i < this.aestheticTexturedSquares.length; i++) {
            var curTexturedSquare = this.aestheticTexturedSquares[i];
            Game.Batch.renderTexturedSquare(curTexturedSquare);
        }
        for (var i = 0; i < this.collidableTexturedSquares.length; i++) {
            var curTexturedSquare = this.collidableTexturedSquares[i];
            Game.Batch.renderTexturedSquare(curTexturedSquare);
        }
    };
};