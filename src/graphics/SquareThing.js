/**
 * Created by Trent on 2/24/2015.
 */

var SquareThing = function() {
    var squareThing = {};
    squareThing.pos = vec3.create();

    squareThing.vertexPositionBuffer = {};
    squareThing.vertexPositionBuffer.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareThing.vertexPositionBuffer.id);
    var vertices = [
        -100, -100,  0,
         100, -100,  0,
         100,  100,  0,
        -100,  100,  0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareThing.vertexPositionBuffer.itemSize = 3;
    squareThing.vertexPositionBuffer.numItems = 4;

    squareThing.textureCoordBuffer = {};
    squareThing.textureCoordBuffer.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareThing.textureCoordBuffer.id);
    var textureCoords = [
        0, 0,
        1, 0,
        1, 1,
        0, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    squareThing.textureCoordBuffer.itemSize = 2;
    squareThing.textureCoordBuffer.numItems = 4;

    squareThing.vertexIndexBuffer = {};
    squareThing.vertexIndexBuffer.id = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareThing.vertexIndexBuffer.id);
    var vertexIndices = [
        0, 1, 2,
        0, 2, 3
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    squareThing.vertexIndexBuffer.itemSize = 1;
    squareThing.vertexIndexBuffer.numItems = 6;

    return squareThing;
};