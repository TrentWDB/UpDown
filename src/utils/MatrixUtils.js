/**
 * Created by Trent on 2/24/2015.
 */

var modelViewMatrixStack = [];

function pushModelViewMatrix() {
    var modelViewMatrixClone = mat4.clone(modelViewMatrix);

    modelViewMatrixStack.push(modelViewMatrixClone);
}

function popModelViewMatrix() {
    if (modelViewMatrixStack.length == 0) {
        throw "Cannot pop matrix. Matrix stack is empty.";
    }

    modelViewMatrix = modelViewMatrixStack.pop();
}


var projectionMatrixStack = [];

function pushProjectionMatrix() {
    var projectionMatrixClone = mat4.clone(projectionMatrix);

    projectionMatrixStack.push(projectionMatrixClone);
}

function popProjectionMatrix() {
    if (projectionMatrixStack.length == 0) {
        throw "Cannot pop matrix. Matrix stack is empty.";
    }

    projectionMatrix = projectionMatrixStack.pop();
}