/**
 * Created by Trent on 3/1/2015.
 */

var GameInput = function() {
    this.KEY_W = 87;
    this.KEY_A = 65;
    this.KEY_D = 68;
    this.KEY_SPACE = 32;

    this.keysDown = [];
    this.keysDeltaDown = [];
    this.keysDeltaUp = [];

    this.deltaKeysToClear = [];

    this.clearDeltas = function() {
        for (var i = 0; i < this.deltaKeysToClear.length; i++) {
            var curKeyCode = this.deltaKeysToClear[i];
            this.keysDeltaDown[curKeyCode] = false;
            this.keysDeltaUp[curKeyCode] = false;
        }

        this.deltaKeysToClear = [];
    };

    this.init = function() {
        for (var i = 0; i < 256; i++) {
            this.keysDown[i] = false;
            this.keysDeltaDown[i] = false;
            this.keysDeltaUp[i] = false;
        }

        var self = this;
        document.addEventListener('keydown', function(e) {
            if (!self.keysDown[e.keyCode]) {
                self.keysDeltaDown[e.keyCode] = true;
                self.deltaKeysToClear.push(e.keyCode);
            }
            self.keysDown[e.keyCode] = true;
        });
        document.addEventListener('keyup', function(e) {
            if (self.keysDown[e.keyCode]) {
                self.keysDeltaUp[e.keyCode] = true;
                self.deltaKeysToClear.push(e.keyCode);
            }
            self.keysDown[e.keyCode] = false;
        });
    };
    this.init();
};