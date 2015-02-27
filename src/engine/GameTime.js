/**
 * Created by Trent on 2/26/2015.
 */



var GameTime = function() {
    this.lastTime;
    this.currentTime;
    this.fpsLastUpdateTime;
    this.fpsFramesSinceLastUpdate;
    this.fps;

    this.update = function() {
        this.lastTime = this.currentTime;
        this.currentTime = new Date().getUTCMilliseconds();

        if (this.fpsLastUpdateTime - this.currentTime < 1000) {
            this.fps = this.fpsFramesSinceLastUpdate;
            this.fpsLastUpdateTime = this.currentTime;
            this.fpsFramesSinceLastUpdate = 0;
        }
        this.fpsFramesSinceLastUpdate++;
    };

    this.getDeltaTime = function() {
        return this.currentTime - this.lastTime;
    };

    this.getFPS = function() {
        return this.fps;
    };

    this.init = function() {
        this.lastTime = new Date().getUTCMilliseconds();
        this.fpsLastUpdateTime = this.lastTime;
        this.fpsFramesSinceLastUpdate = 0;
        this.fps = 0;
        this.currentTime = this.lastTime;
    };
    this.init();
};