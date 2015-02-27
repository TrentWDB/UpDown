/**
 * Created by Trent on 2/24/2015.
 */

var ShaderProgram = function(vertShader, fragShader) {
    this.id = gl.createProgram();
    var vertexShader = getShader(gl, 'shader-vs');
    var fragmentShader = getShader(gl, 'shader-fs');
    gl.attachShader(this.id, vertexShader);
    gl.attachShader(this.id, fragmentShader);
    gl.linkProgram(this.id);

    if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
        alert('Could not link shaders');
    }

    this.vertexPositionAttribute = gl.getAttribLocation(this.id, 'vertexPosition');
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.textureCoordAttribute = gl.getAttribLocation(this.id, 'textureCoord');
    gl.enableVertexAttribArray(this.textureCoordAttribute);

    this.modelViewMatrixUniform = gl.getUniformLocation(this.id, 'modelViewMatrix');
    this.projectionMatrixUniform = gl.getUniformLocation(this.id, 'projectionMatrix');

    this.samplerUniform = gl.getUniformLocation(this.id, 'sampler');


    this.use = function() {
        gl.useProgram(this.id);//TODO what is this in this context
    };
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