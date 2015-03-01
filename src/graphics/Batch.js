/**
 * Created by Trent on 2/27/2015.
 */

var Batch = function() {
    this.renderTexturedSquare = function(texturedSquare) {
        gl.bindBuffer(gl.ARRAY_BUFFER, texturedSquare.vertexPositionBuffer.id);
        gl.vertexAttribPointer(Game.Graphics.currentShaderProgram.vertexPositionAttribute, texturedSquare.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texturedSquare.textureCoordBuffer.id);
        gl.vertexAttribPointer(Game.Graphics.currentShaderProgram.textureCoordAttribute, texturedSquare.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        //gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texturedSquare.texture.id);
        gl.uniform1i(Game.Graphics.currentShaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, texturedSquare.vertexIndexBuffer.id);

        pushModelViewMatrix();
        mat4.translate(modelViewMatrix, modelViewMatrix, texturedSquare.pos);
        Game.Graphics.loadShaderUniforms();
        popModelViewMatrix();

        gl.drawElements(gl.TRIANGLES, texturedSquare.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
};