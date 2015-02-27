/**
 * Created by Trent on 2/24/2015.
 */

var gl;
var modelViewMatrix;
var projectionMatrix;

var Graphics = function() {
    this.shaderProgram;
    this.texture1;
    this.squareThing1;

    this.initGraphics = function(canvas) {
        var canvasOptions = {
            antialias: true
        };
        gl = canvas.getContext('webgl', canvasOptions) || canvas.getContext('experimental-webgl', canvasOptions);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        projectionMatrix = mat4.create();
        mat4.ortho(projectionMatrix, 0, canvas.width, canvas.height, 0, 1, -1);
        modelViewMatrix = mat4.create();

        this.shaderProgram = new ShaderProgram('shader-vs', 'shader-fs');

        this.loadTextures();

        this.squareThing1 = new SquareThing();
        vec3.add(this.squareThing1.pos, this.squareThing1.pos, vec3.fromValues(300, 300, 0));
    };

    this.loadTextures = function() {
        this.texture1 = new Texture('textures/texture1.png', false);
    };

    this.loadShaderUniforms = function() {gl.uniformMatrix4fv(this.shaderProgram.modelViewMatrixUniform, false, new Float32Array(modelViewMatrix));
        gl.uniformMatrix4fv(this.shaderProgram.projectionMatrixUniform, false, new Float32Array(projectionMatrix));
    };

    this.render = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.shaderProgram.use();

        this.renderSquareThing(this.squareThing1);
    };

    this.renderSquareThing = function(squareThing) {
        gl.bindBuffer(gl.ARRAY_BUFFER, squareThing.vertexPositionBuffer.id);
        gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, squareThing.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareThing.textureCoordBuffer.id);
        gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, squareThing.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture1.id);
        gl.uniform1i(this.shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareThing.vertexIndexBuffer.id);

        pushModelViewMatrix();
        mat4.translate(modelViewMatrix, modelViewMatrix, squareThing.pos);
        this.loadShaderUniforms();
        popModelViewMatrix();

        gl.drawElements(gl.TRIANGLES, squareThing.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
};