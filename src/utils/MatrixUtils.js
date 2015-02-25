/**
 * Created by Trent on 2/24/2015.
 */

var modelViewMatrixStack = [];

function pushModelViewMatrix() {
    modelViewMatrixStack.push(modelViewMatrix);
}

function popModelViewMatrix() {
    if (modelViewMatrixStack.length == 0) {
        throw "Cannot pop matrix. Matrix stack is empty.";
    }

    modelViewMatrix = modelViewMatrixStack.pop();
}


var projectionMatrixStack = [];

function pushModelViewMatrix() {
    projectionMatrixStack.push(projectionMatrix);
}

function popModelViewMatrix() {
    if (projectionMatrixStack.length == 0) {
        throw "Cannot pop matrix. Matrix stack is empty.";
    }

    projectionMatrix = projectionMatrixStack.pop();
}