/**
 * Created by Trent on 2/24/2015.
 */

var gl;
var modelViewMatrix;
var projectionMatrix;
var shaderProgram;
var texture1;
var squareThing1;

function initGraphics(canvas) {
    var canvasOptions = {
        antialias: true
    };
    gl = canvas.getContext('webgl', canvasOptions) || canvas.getContext('experimental-webgl', canvasOptions);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, 0, canvas.width, canvas.height, 0, 1, -1);
    modelViewMatrix = mat4.create();

    shaderProgram = ShaderProgram('shader-vs', 'shader-fs');

    loadTextures();

    squareThing1 = SquareThing();
    vec3.add(squareThing1.pos, squareThing1.pos, vec3.fromValues(300, 300, 0));
}

function loadTextures() {
    texture1 = Texture('textures/texture1.png', false);
}

function loadShaderUniforms() {
    gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, new Float32Array(modelViewMatrix));
    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, new Float32Array(projectionMatrix));
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shaderProgram.use();

    renderSquareThing(squareThing1)
}

function renderSquareThing(squareThing) {
    gl.bindBuffer(gl.ARRAY_BUFFER, squareThing.vertexPositionBuffer.id);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareThing.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareThing.textureCoordBuffer.id);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareThing.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1.id);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareThing.vertexIndexBuffer.id);

    pushModelViewMatrix();
    mat4.translate(modelViewMatrix, modelViewMatrix, squareThing.pos);
    loadShaderUniforms();
    popModelViewMatrix();

    gl.drawElements(gl.TRIANGLES, squareThing.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}