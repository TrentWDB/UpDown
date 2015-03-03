/**
 * Created by Trent on 2/27/2015.
 */

var PlayerManager = function() {
    this.PLAYER_WIDTH = 100;

    this.player;
    this.otherPlayer;

    this.createPlayers = function() {
        var player1Pos = vec3.fromValues(200, -100, 0);
        var player1TexturedSquare = new TexturedSquare(vec3.fromValues(-this.PLAYER_WIDTH / 2, -this.PLAYER_WIDTH / 2, 0), vec2.fromValues(this.PLAYER_WIDTH, this.PLAYER_WIDTH), null, Game.Graphics.playerTexture1);
        this.player = new Player(player1Pos, player1TexturedSquare);

        var player2Pos = vec3.fromValues(1400, -150, 0);
        var player2TexturedSquare = new TexturedSquare(vec3.fromValues(-this.PLAYER_WIDTH / 2, -this.PLAYER_WIDTH / 2, 0), vec2.fromValues(this.PLAYER_WIDTH, this.PLAYER_WIDTH), null, Game.Graphics.playerTexture2);
        this.otherPlayer = new Player(player2Pos, player2TexturedSquare);
    };

    this.render = function() {
        //player 1
        pushModelViewMatrix();
        mat4.translate(modelViewMatrix, modelViewMatrix, this.player.pos);
        Game.Batch.renderTexturedSquare(this.player.texturedSquare);
        popModelViewMatrix();

        //player 2
        pushModelViewMatrix();
        mat4.translate(modelViewMatrix, modelViewMatrix, this.otherPlayer.pos);
        Game.Batch.renderTexturedSquare(this.otherPlayer.texturedSquare);
        popModelViewMatrix();
    };
};