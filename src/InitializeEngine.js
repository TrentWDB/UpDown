/**
 * Created by Trent on 2/24/2015.
 */

window.onload = function() {
    var canvas = document.getElementById('render-space');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initGraphics(canvas);

    setInterval(tick, 1000 / 30);
}