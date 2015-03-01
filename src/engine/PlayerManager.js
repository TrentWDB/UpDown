/**
 * Created by Trent on 2/27/2015.
 */

var PlayerManager = function() {
    this.player1;
    this.player2;

    this.createPlayers = function() {
        console.log("creating players");
        var player1Pos = vec3.fromValues(200, 100, 0);
        var player1TexturedSquare = new TexturedSquare(vec3.fromValues(-50, -50, 0), vec2.fromValues(100, 100), null, Game.Graphics.playerTexture1);
        this.player1 = new Player(player1Pos, player1TexturedSquare);

        var player2Pos = vec3.fromValues(1400, 150, 0);
        var player2TexturedSquare = new TexturedSquare(vec3.fromValues(-50, -50, 0), vec2.fromValues(100, 100), null, Game.Graphics.playerTexture2);
        this.player2 = new Player(player2Pos, player2TexturedSquare);
    };

    this.render = function() {
        //player 1
        pushModelViewMatrix();
        mat4.translate(modelViewMatrix, modelViewMatrix, this.player1.pos);
        Game.Batch.renderTexturedSquare(this.player1.texturedSquare);
        popModelViewMatrix();

        //player 2
        pushModelViewMatrix();
        mat4.translate(modelViewMatrix, modelViewMatrix, this.player2.pos);
        Game.Batch.renderTexturedSquare(this.player2.texturedSquare);
        popModelViewMatrix();
    };
};