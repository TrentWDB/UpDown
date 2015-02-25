/**
 * Created by Trent on 2/24/2015.
 */

var ShaderProgram = function(vertShader, fragShader) {
    var shaderProgram = {};
    shaderProgram.id = gl.createProgram();
    var vertexShader = getShader(gl, 'shader-vs');
    var fragmentShader = getShader(gl, 'shader-fs');
    gl.attachShader(shaderProgram.id, vertexShader);
    gl.attachShader(shaderProgram.id, fragmentShader);
    gl.linkProgram(shaderProgram.id);

    if (!gl.getProgramParameter(shaderProgram.id, gl.LINK_STATUS)) {
        alert('Could not link shaders');
    }

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram.id, 'vertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram.id, 'textureCoord');
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram.id, 'modelViewMatrix');
    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram.id, 'projectionMatrix');

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram.id, 'sampler');

    return shaderProgram;
};

function getShader(gl, shaderId) {
    var shaderScript = document.getElementById(shaderId);
    if (!shaderScript) {
        return null;
    }

    var str = '';
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}