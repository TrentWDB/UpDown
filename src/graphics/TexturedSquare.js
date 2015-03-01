/**
 * Created by Trent on 2/24/2015.
 */

var TexturedSquare = function(pos, dimensions, textureCoords, texture) {
    this.pos = pos;
    this.texture = texture;

    this.vertexPositionBuffer = {};
    this.vertexPositionBuffer.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer.id);
    var vertices = [
        0,              0,              0,
        dimensions[0],  0,              0,
        dimensions[0],  dimensions[1],  0,
        0,              dimensions[1],  0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 4;

    this.textureCoordBuffer = {};
    this.textureCoordBuffer.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer.id);
    if (textureCoords == null) {
        textureCoords = [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.textureCoordBuffer.itemSize = 2;
    this.textureCoordBuffer.numItems = 4;

    this.vertexIndexBuffer = {};
    this.vertexIndexBuffer.id = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer.id);
    var vertexIndices = [
        0, 1, 2,
        0, 2, 3
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = 6;
};