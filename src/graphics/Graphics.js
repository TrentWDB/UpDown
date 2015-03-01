/**
 * Created by Trent on 2/24/2015.
 */

var gl;
var modelViewMatrix;
var projectionMatrix;

var Graphics = function() {
    this.currentShaderProgram;
    this.playerTexture1;
    this.playerTexture2;
    this.wallTexture;

    this.initGraphics = function(canvas) {
        var canvasOptions = {
            antialias: true
        };
        gl = canvas.getContext('webgl', canvasOptions) || canvas.getContext('experimental-webgl', canvasOptions);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        projectionMatrix = mat4.create();
        mat4.ortho(projectionMatrix, 0, canvas.width, canvas.height, 0, 1, -100);
        modelViewMatrix = mat4.create();

        this.currentShaderProgram = new ShaderProgram('shader-vs', 'shader-fs');

        this.loadTextures();

        Game.PlayerManager.createPlayers();
        Game.Level.createLevel();
    };

    this.loadTextures = function() {
        this.playerTexture1 = new Texture('textures/blob1.png', false);
        this.playerTexture2 = new Texture('textures/blob2.png', false);
        this.wallTexture = new Texture('textures/repeating-wall.png', false);
    };

    this.loadShaderUniforms = function() {
        gl.uniformMatrix4fv(this.currentShaderProgram.modelViewMatrixUniform, false, new Float32Array(modelViewMatrix));
        gl.uniformMatrix4fv(this.currentShaderProgram.projectionMatrixUniform, false, new Float32Array(projectionMatrix));
    };

    this.render = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.currentShaderProgram.use();

        Game.Level.render();

        Game.PlayerManager.render();
    };
};