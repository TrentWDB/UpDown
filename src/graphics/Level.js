/**
 * Created by Trent on 2/27/2015.
 */

var Level = function() {
    this.aestheticTexturedSquares = [];
    this.collidableTexturedSquares = [];

    this.createLevel = function() {
        var frontWallTextCoords = [
            0, 0,
            20, 0,
            20, 20,
            0, 20
        ];
        var frontWall = new TexturedSquare(vec3.fromValues(0, -960, 0), vec2.fromValues(1920, 1920), frontWallTextCoords, Game.Graphics.wallTexture);
        this.aestheticTexturedSquares.push(frontWall);

        var floorLeftTextCoords = [
            0, 0,
            30, 0,
            30, 1,
            0, 1
        ];
        var floorLeft = new TexturedSquare(vec3.fromValues(0, -10, 0), vec2.fromValues(600, 20), floorLeftTextCoords, Game.Graphics.floorTexture);
        this.collidableTexturedSquares.push(floorLeft);

        var floorRightTextCoords = [
            0, 0,
            30, 0,
            30, 1,
            0, 1
        ];
        var floorRight = new TexturedSquare(vec3.fromValues(Game.canvas.width - 600, -10, 0), vec2.fromValues(600, 20), floorRightTextCoords, Game.Graphics.floorTexture);
        this.collidableTexturedSquares.push(floorRight);
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