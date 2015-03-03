/**
 * Created by Trent on 2/24/2015.
 */

var Physics = function() {
    this.GRAVITY = 0.005;
    this.ACCEL = 0.01;
    this.MAX_SPEED = 0.7;
    this.JUMP_ACCEL = 1;
    this.FRICTION = 0.005;

    this.isOnGround = false;

    this.update = function(deltaTime) {
        var player = Game.PlayerManager.player;
        var maxSpeed = Math.max(Math.abs(player.vel[0]), Math.abs(player.vel[1]));
        var updateIntervalCount = Math.max(Math.ceil(maxSpeed / Game.PlayerManager.PLAYER_WIDTH), 1);
        var updateIntervalDeltaTime = deltaTime / updateIntervalCount;

        for (var i = 0; i < updateIntervalCount; i++) {
            this.updateOnInterval(updateIntervalDeltaTime);
        }
    };

    this.updateOnInterval = function(deltaTime) {
        var oldPos = vec3.clone(Game.PlayerManager.player.pos);
        var oldVel = vec3.clone(Game.PlayerManager.player.vel);

        var newVel = vec3.create();
        this.applyForces(newVel, oldPos, oldVel, deltaTime);

        var newPos = vec3.create();
        this.calculateCollisions(newPos, oldPos, oldVel, newVel, deltaTime);

        Game.PlayerManager.player.vel = newVel;
        Game.PlayerManager.player.pos = newPos;
    };

    this.calculateCollisions = function(newPos, oldPos, oldVel, newVel, deltaTime) {
        var player = Game.PlayerManager.player;
        var otherPlayer = Game.PlayerManager.otherPlayer;
        var tryNewPos = vec3.fromValues(oldPos[0] + newVel[0], oldPos[1] + newVel[1], 0);

        var remainingLength = Math.sqrt(newVel[0] * newVel[0] + newVel[1] * newVel[1]);
        while (remainingLength > 0) {
            var guyMinVertex = [player.pos[0] - PlayerManager.PLAYER_WIDTH / 2, player.pos[1] - PlayerManager.PLAYER_WIDTH / 2];
            var guyMaxVertex = [player.pos[0] + PlayerManager.PLAYER_WIDTH / 2, player.pos[1] + PlayerManager.PLAYER_WIDTH / 2];

            var farthestInsideX = 0;
            var farthestInsideY = 0;
            var farthestInsideOtherGuyX = 0;
            var farthestInsideOtherGuyY = 0;
            //calculate how far inside all the objects the guy is
            for (var i = 0; i < Game.Level.collidableTexturedSquares.length; i++) {
                var curCollidable = Game.Level.collidableTexturedSquares[i];
                var curCollidableMinVertex = [curCollidable.pos[0] - curCollidable.dimensions[0] / 2, curCollidable.pos[1] - curCollidable.dimensions[1] / 2];
                var curCollidableMaxVertex = [curCollidable.pos[0] + curCollidable.dimensions[0] / 2, curCollidable.pos[1] + curCollidable.dimensions[1] / 2];

                var guyMaxMinusMinX = guyMaxVertex[0] - curCollidableMinVertex[0];
                var guyMaxMinusMinY = guyMaxVertex[1] - curCollidableMinVertex[1];
                var collidableMaxMinusMinX = curCollidableMaxVertex[0] - guyMinVertex[0];
                var collidableMaxMinusMinY = curCollidableMaxVertex[1] - guyMinVertex[1];
                if (guyMaxMinusMinX > 0 && guyMaxMinusMinY > 0 && collidableMaxMinusMinX > 0 && collidableMaxMinusMinY > 0) {
                    farthestInsideX = Math.max(Math.min(guyMaxMinusMinX, collidableMaxMinusMinX), farthestInsideX);
                    farthestInsideY = Math.max(Math.min(guyMaxMinusMinY, collidableMaxMinusMinY), farthestInsideY);
                }
            }

            //calculate how far inside the other guy the guy is
            var otherGuyMinVertex = [player.pos[0] - PlayerManager.PLAYER_WIDTH / 2, player.pos[1] - PlayerManager.PLAYER_WIDTH / 2];
            var otherGuyMaxVertex = [player.pos[0] + PlayerManager.PLAYER_WIDTH / 2, player.pos[1] + PlayerManager.PLAYER_WIDTH / 2];
            var guyMaxMinusMinX = guyMaxVertex[0] - otherGuyMinVertex[0];
            var guyMaxMinusMinY = guyMaxVertex[1] - otherGuyMinVertex[1];
            var otherGuyMaxMinusMinX = otherGuyMaxVertex[0] - guyMinVertex[0];
            var otherGuyMaxMinusMinY = otherGuyMaxVertex[1] - guyMinVertex[1];
            farthestInsideOtherGuyX = Math.max(Math.min(guyMaxMinusMinX, otherGuyMaxMinusMinX), 0);
            farthestInsideOtherGuyY = Math.max(Math.min(guyMaxMinusMinY, otherGuyMaxMinusMinY), 0);

            remainingLength = 0;
        }

        newPos[0] = oldPos[0] + (newVel[0] + oldVel[0]) / 2 * deltaTime;
        newPos[1] = oldPos[1] + (newVel[1] + oldVel[1]) / 2 * deltaTime;
    };

    this.applyForces = function(newVel, oldPos, oldVel, deltaTime) {
        var player = Game.PlayerManager.player;
        var oldWorldSide = this.calculateWorldSide(oldPos);
        var velAddX = 0;
        var velAddY = 0;
        if (Game.GameInput.keysDown[Game.GameInput.KEY_A]) {
            velAddX -= this.ACCEL * deltaTime;
            console.log('a down');
        }
        if (Game.GameInput.keysDown[Game.GameInput.KEY_D]) {
            velAddX += this.ACCEL * deltaTime;
            console.log('d down');
        }

        if (Game.GameInput.keysDown[Game.GameInput.KEY_W]/* && this.isOnGround*/) {
            velAddY += oldWorldSide * this.JUMP_ACCEL;
        }

        newVel[0] = oldVel[0];
        newVel[1] = oldVel[1];

        newVel[0] += velAddX;
        newVel[1] += velAddY;

        //apply friction before its capped
        if (newVel[0] != 0) {
            var friction = -newVel[0] / Math.abs(newVel[0]);
            friction *= this.FRICTION * deltaTime;
            if (Math.abs(friction) > Math.abs(newVel[0])) {
                newVel[0] = 0;
            } else {
                newVel[0] += friction;
            }
        }

        newVel[0] = Math.min(this.MAX_SPEED, newVel[0]);
        newVel[0] = Math.max(-this.MAX_SPEED, newVel[0]);

        //get new position to see if you passed the zero point
        var newPos = vec3.fromValues(0, oldPos[1] + (newVel[1] + oldVel[1]) / 2 * deltaTime - oldWorldSide * this.GRAVITY * deltaTime * deltaTime, 0);

        var newWorldSide = this.calculateWorldSide(newPos);
        if (oldWorldSide != newWorldSide) {
            var a = 0.5 * this.GRAVITY;
            var b = Math.abs(newVel[1]);
            var c = -Math.abs(oldPos[1]);
            var quadFormNumeratorLeft = -b;
            var quadFormNumeratorRight = Math.sqrt(b * b - 4 * a * c);
            var quadFormDenominator = 2 * a;
            var timeToZero = (quadFormNumeratorLeft + quadFormNumeratorRight) / quadFormDenominator;
            //console.log(deltaTime + ' - ' + timeToZero + ' - ' + oldPos[1] + ' - ' + newVel[1]);

            //apply gravity from old region
            newVel[1] -= oldWorldSide * this.GRAVITY * timeToZero;
            //apply gravity from new region
            newVel[1] -= newWorldSide * this.GRAVITY * (deltaTime - timeToZero);
        } else {
            newVel[1] -= oldWorldSide * this.GRAVITY * deltaTime;
        }
    };

    this.calculateWorldSide = function(pos) {
        if (pos[1] <= 0) {
            return -1;
        }

        return 1;
    };
};
