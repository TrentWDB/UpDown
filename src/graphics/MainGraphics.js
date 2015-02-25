/**
 * Created by Trent on 2/24/2015.
 */

var gl;

function initGraphics(canvas) {
    var canvasOptions = {
        antialias: true
    };
    gl = canvas.getContext('webgl', canvasOptions) || canvas.getContext('experimental-webgl', canvasOptions);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.
}

function graphicsUpdate() {

}