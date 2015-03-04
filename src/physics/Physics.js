/**
 * Created by Trent on 2/24/2015.
 */

var Physics = function() {
    this.GRAVITY = 0.0035;
    this.ACCEL = 0.01;
    this.MAX_SPEED = 0.7;
    this.JUMP_ACCEL = 1;
    this.FRICTION = 0.005;
    this.RESTITUTION = 0.2;
    this.BOUNCE_SPEED = 1.6;
    this.MAX_STEP_HEIGHT = 8;
    this.TOLERANCE = 0.000001;

    this.isOnGround = false;

    this.update = function(deltaTime) {
        var player = Game.PlayerManager.player;
        var maxSpeed = Math.max(Math.abs(player.vel[0]), Math.abs(player.vel[1]));
        var updateIntervalCount = Math.max(Math.ceil(maxSpeed / Game.PlayerManager.PLAYER_WIDTH), 1);
        var updateIntervalDeltaTime = deltaTime / updateIntervalCount;

        for (var i = 0; i < updateIntervalCount; i++) {
            this.updateSplitAtZeroOnInterval(updateIntervalDeltaTime);
        }
    };

    this.updateSplitAtZeroOnInterval = function(deltaTime) {
        var oldPos = vec3.clone(Game.PlayerManager.player.pos);
        var oldVel = vec3.clone(Game.PlayerManager.player.vel);

        var deltaTimeRemaining = deltaTime;
        do {
            oldPos = vec3.clone(Game.PlayerManager.player.pos);
            oldVel = vec3.clone(Game.PlayerManager.player.vel);

            var timeToZero = this.getMillisToZero(oldPos, oldVel);

            if (timeToZero > 0 && timeToZero <= deltaTimeRemaining) {
                this.updateOnInterval(timeToZero);

                deltaTimeRemaining -= timeToZero;
            } else {
                this.updateOnInterval(deltaTimeRemaining);
                deltaTimeRemaining = 0;
            }
        } while (deltaTimeRemaining > 0);
    };

    this.updateOnInterval = function(deltaTime) {
        var oldPos = vec3.clone(Game.PlayerManager.player.pos);
        var oldVel = vec3.clone(Game.PlayerManager.player.vel);
        var newVel = vec3.create();
        var newPos = vec3.create();
        this.applyForces(newVel, oldPos, oldVel, deltaTime);

        this.calculateCollisions(newPos, newVel, oldPos, oldVel, deltaTime);

        Game.PlayerManager.player.vel = newVel;
        Game.PlayerManager.player.pos = newPos;
    };

    this.calculateCollisions = function(newPos, newVel, oldPos, oldVel, deltaTime) {
        var player = Game.PlayerManager.player;
        var otherPlayer = Game.PlayerManager.otherPlayer;

        var remainingDeltaTime = deltaTime;
        do {
            var addDistX = (newVel[0] + oldVel[0]) / 2 * remainingDeltaTime;
            var addDistY = (newVel[1] + oldVel[1]) / 2 * remainingDeltaTime;

            var guyVelAngle = Math.atan2(addDistY, addDistX);
            var tryNewPos = vec3.fromValues(oldPos[0] + addDistX, oldPos[1] + addDistY, 0);

            var guyMinVertex = [tryNewPos[0] - Game.PlayerManager.PLAYER_WIDTH / 2, tryNewPos[1] - Game.PlayerManager.PLAYER_WIDTH / 2];
            var guyMaxVertex = [tryNewPos[0] + Game.PlayerManager.PLAYER_WIDTH / 2, tryNewPos[1] + Game.PlayerManager.PLAYER_WIDTH / 2];

            var colMinVertex = [0, 0];
            var colMaxVertex = [0, 0];
            var insideAmountX = 0;
            var insideAmountY = 0;
            var farthestInsideOtherGuyX = false;
            var farthestInsideOtherGuyY = false;
            //calculate how far inside all the objects the guy is
            for (var i = 0; i < Game.Level.collidableTexturedSquares.length; i++) {
                var curCollidable = Game.Level.collidableTexturedSquares[i];
                var curCollidableMinVertex = [curCollidable.pos[0], curCollidable.pos[1]];
                var curCollidableMaxVertex = [curCollidable.pos[0] + curCollidable.dimensions[0], curCollidable.pos[1] + curCollidable.dimensions[1]];

                var guyCollidableMaxMinusMinX = guyMaxVertex[0] - curCollidableMinVertex[0];
                var guyCollidableMaxMinusMinY = guyMaxVertex[1] - curCollidableMinVertex[1];
                var collidableMaxMinusMinX = curCollidableMaxVertex[0] - guyMinVertex[0];
                var collidableMaxMinusMinY = curCollidableMaxVertex[1] - guyMinVertex[1];
                if (guyCollidableMaxMinusMinX > 0 && guyCollidableMaxMinusMinY > 0 && collidableMaxMinusMinX > 0 && collidableMaxMinusMinY > 0) {
                    var insideXMin = Math.min(guyCollidableMaxMinusMinX, collidableMaxMinusMinX);
                    if (insideXMin > insideAmountX) {
                        insideAmountX = insideXMin;
                        colMinVertex[0] = curCollidableMinVertex[0];
                        colMaxVertex[0] = curCollidableMaxVertex[0];
                    }
                    var insideYMin = Math.min(guyCollidableMaxMinusMinY, collidableMaxMinusMinY);
                    if (insideYMin > insideAmountY) {
                        insideAmountY = insideYMin;
                        colMinVertex[1] = curCollidableMinVertex[1];
                        colMaxVertex[1] = curCollidableMaxVertex[1];
                    }
                }
            }

            //calculate how far inside the other guy the guy is
            var otherGuyMinVertex = [otherPlayer.pos[0] - Game.PlayerManager.PLAYER_WIDTH / 2, otherPlayer.pos[1] - Game.PlayerManager.PLAYER_WIDTH / 2];
            var otherGuyMaxVertex = [otherPlayer.pos[0] + Game.PlayerManager.PLAYER_WIDTH / 2, otherPlayer.pos[1] + Game.PlayerManager.PLAYER_WIDTH / 2];
            var guyMaxMinusMinX = guyMaxVertex[0] - otherGuyMinVertex[0];
            var guyMaxMinusMinY = guyMaxVertex[1] - otherGuyMinVertex[1];
            var otherGuyMaxMinusMinX = otherGuyMaxVertex[0] - guyMinVertex[0];
            var otherGuyMaxMinusMinY = otherGuyMaxVertex[1] - guyMinVertex[1];
            if (guyMaxMinusMinX > 0 && guyMaxMinusMinY > 0 && otherGuyMaxMinusMinX > 0 && otherGuyMaxMinusMinY > 0) {
                var farthestInsideOtherGuyAmountX = Math.max(Math.min(guyMaxMinusMinX, otherGuyMaxMinusMinX), 0);
                var farthestInsideOtherGuyAmountY = Math.max(Math.min(guyMaxMinusMinY, otherGuyMaxMinusMinY), 0);
                if (farthestInsideOtherGuyAmountX > insideAmountX) {
                    farthestInsideOtherGuyX = true;
                    insideAmountX = farthestInsideOtherGuyAmountX;
                    colMinVertex[0] = otherGuyMinVertex[0];
                    colMaxVertex[0] = otherGuyMaxVertex[0];
                }
                if (farthestInsideOtherGuyAmountY > insideAmountY) {
                    farthestInsideOtherGuyY = true;
                    insideAmountY = farthestInsideOtherGuyAmountY;
                    colMinVertex[1] = otherGuyMinVertex[1];
                    colMaxVertex[1] = otherGuyMaxVertex[1];
                }
            }

            if (oldVel[1] != 0) {
                this.isOnGround = false;
            }
            if (insideAmountX > 0 || insideAmountY > 0) {
                var lineTop = [
                    [colMinVertex[0] - Game.PlayerManager.PLAYER_WIDTH / 2, colMinVertex[1] - Game.PlayerManager.PLAYER_WIDTH / 2],
                    [colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2, colMinVertex[1] - Game.PlayerManager.PLAYER_WIDTH / 2]
                ];
                var lineRight = [
                    [colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2, colMinVertex[1] - Game.PlayerManager.PLAYER_WIDTH / 2],
                    [colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2, colMaxVertex[1] + Game.PlayerManager.PLAYER_WIDTH / 2]
                ];
                var lineBottom = [
                    [colMinVertex[0] - Game.PlayerManager.PLAYER_WIDTH / 2, colMaxVertex[1] + Game.PlayerManager.PLAYER_WIDTH / 2],
                    [colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2, colMaxVertex[1] + Game.PlayerManager.PLAYER_WIDTH / 2]
                ];
                var lineLeft = [
                    [colMinVertex[0] - Game.PlayerManager.PLAYER_WIDTH / 2, colMinVertex[1] - Game.PlayerManager.PLAYER_WIDTH / 2],
                    [colMinVertex[0] - Game.PlayerManager.PLAYER_WIDTH / 2, colMaxVertex[1] + Game.PlayerManager.PLAYER_WIDTH / 2]
                ];

                var hitHorizontal = false;
                var hitVertical = false;
                if (oldPos[0] > lineTop[0][0] && oldPos[0] < lineTop[1][0]) {
                    hitHorizontal = true;
                } else if (oldPos[1] > lineRight[0][1] && oldPos[1] < lineRight[1][1]) {
                    hitVertical = true;
                } else {
                    var guyVelLineX = tryNewPos[0] - oldPos[0];
                    var guyVelLineY = tryNewPos[1] - oldPos[1];
                    var guyVelLineLength = Math.sqrt(guyVelLineX * guyVelLineX + guyVelLineY * guyVelLineY);
                    var widthTolerance = 50;
                    var guyVelLine = [
                        [oldPos[0] - widthTolerance * guyVelLineX / guyVelLineLength, oldPos[1] - widthTolerance * guyVelLineY / guyVelLineLength],
                        [tryNewPos[0] + widthTolerance * guyVelLineX / guyVelLineLength, tryNewPos[1] + widthTolerance * guyVelLineY / guyVelLineLength]
                    ];

                    var distanceToTopIntersectionSquared = Number.MAX_VALUE;
                    var distanceToRightIntersectionSquared = Number.MAX_VALUE;
                    var distanceToBottomIntersectionSquared = Number.MAX_VALUE;
                    var distanceToLeftIntersectionSquared = Number.MAX_VALUE;

                    var lineTopIntersection = this.pointOfIntersection(guyVelLine, lineTop);
                    var lineRightIntersection = this.pointOfIntersection(guyVelLine, lineRight);
                    var lineBottomIntersection = this.pointOfIntersection(guyVelLine, lineBottom);
                    var lineLeftIntersection = this.pointOfIntersection(guyVelLine, lineLeft);
                    if (lineTopIntersection != Number.NaN && this.lineIntersection(guyVelLine, lineTop) != 0) {
                        var distX = lineTopIntersection[0] - oldPos[0];
                        var distY = lineTopIntersection[1] - oldPos[1];
                        distanceToTopIntersectionSquared = Math.sqrt(distX * distX + distY * distY);
                    }
                    if (lineRightIntersection != Number.NaN && this.lineIntersection(guyVelLine, lineRight) != 0) {
                        var distX = lineRightIntersection[0] - oldPos[0];
                        var distY = lineRightIntersection[1] - oldPos[1];
                        distanceToRightIntersectionSquared = Math.sqrt(distX * distX + distY * distY);
                    }
                    if (lineBottomIntersection != Number.NaN && this.lineIntersection(guyVelLine, lineBottom) != 0) {
                        var distX = lineBottomIntersection[0] - oldPos[0];
                        var distY = lineBottomIntersection[1] - oldPos[1];
                        distanceToBottomIntersectionSquared = Math.sqrt(distX * distX + distY * distY);

                    }
                    if (lineLeftIntersection != Number.NaN && this.lineIntersection(guyVelLine, lineLeft) != 0) {
                        var distX = lineLeftIntersection[0] - oldPos[0];
                        var distY = lineLeftIntersection[1] - oldPos[1];
                        distanceToLeftIntersectionSquared = Math.sqrt(distX * distX + distY * distY);
                    }

                    if (distanceToTopIntersectionSquared < distanceToRightIntersectionSquared
                        && distanceToTopIntersectionSquared < distanceToLeftIntersectionSquared) {
                        hitHorizontal = true;
                    } else if (distanceToBottomIntersectionSquared < distanceToRightIntersectionSquared
                        && distanceToBottomIntersectionSquared < distanceToLeftIntersectionSquared) {
                        hitHorizontal = true;
                    } else if (distanceToRightIntersectionSquared < distanceToTopIntersectionSquared
                        && distanceToRightIntersectionSquared < distanceToBottomIntersectionSquared) {
                        hitVertical = true;
                    } else if (distanceToLeftIntersectionSquared < distanceToTopIntersectionSquared
                        && distanceToLeftIntersectionSquared < distanceToBottomIntersectionSquared) {
                        hitVertical = true;
                    }
                }

                var totalCurrentDistance = Math.sqrt(addDistX * addDistX + addDistY * addDistY);

                var curVelX = oldVel[0] + (newVel[0] - oldVel[0]) * remainingDeltaTime / deltaTime;
                var curVelY = oldVel[1] + (newVel[1] - oldVel[1]) * remainingDeltaTime / deltaTime;

                if (hitVertical) {
                    var xDir = Math.abs(addDistX) / addDistX;
                    var backupAmountX = xDir * (insideAmountX + 0.1);
                    var xToYMult = Math.sin(guyVelAngle) / Math.cos(guyVelAngle);
                    var backupAmountY = backupAmountX * xToYMult;

                    var newDesiredXPos = tryNewPos[0] - backupAmountX;
                    var newDesiredYPos = tryNewPos[1] - backupAmountY;

                    var distanceTraveledX = newDesiredXPos - oldPos[0];
                    var distanceTraveledY = newDesiredYPos - oldPos[1];
                    var distanceTraveled = Math.sqrt(distanceTraveledX * distanceTraveledX + distanceTraveledY * distanceTraveledY);
                    distanceTraveled += Math.abs(tryNewPos[1] - newDesiredYPos);
                    remainingDeltaTime *= Math.max((1 - distanceTraveled / totalCurrentDistance), 0);

                    var addDistYSignum = Math.abs(addDistY) / addDistY;
                    if (insideAmountY < this.MAX_STEP_HEIGHT && (addDistYSignum == 0 || addDistYSignum == -this.calculateWorldSide(oldPos, oldVel))) {
                        tryNewPos[1] -= (insideAmountY + 0.1) * addDistYSignum;
                        oldPos[0] = tryNewPos[0];
                    } else {
                        oldPos[0] = newDesiredXPos;
                        tryNewPos[0] = newDesiredXPos;
                    }
                    oldPos[1] = tryNewPos[1];

                    if (Math.abs(curVelX) >= this.BOUNCE_SPEED) {
                        var changeInXVelAfterHit = (newVel[0] - oldVel[0]) * (remainingDeltaTime / deltaTime);
                        var desiredXVel = -curVelX * this.RESTITUTION;
                        oldVel[0] = desiredXVel;
                        newVel[0] = desiredXVel + changeInXVelAfterHit;
                    } else {
                        oldVel[0] = 0;
                        newVel[0] = 0;
                    }
                } else {
                    var yDir = Math.abs(addDistY) / addDistY;
                    var backupAmountY = yDir * (insideAmountY + 0.1);
                    var yToXMult = Math.cos(guyVelAngle) / Math.sin(guyVelAngle);

                    var newDesiredXPos = tryNewPos[0] - backupAmountY * yToXMult;
                    var newDesiredYPos = tryNewPos[1] - backupAmountY;//TODO might have to add a little to keep it from colliding again

                    var distanceTraveledX = newDesiredXPos - oldPos[0];
                    var distanceTraveledY = newDesiredYPos - oldPos[1];
                    var distanceTraveled = Math.sqrt(distanceTraveledX * distanceTraveledX + distanceTraveledY * distanceTraveledY);
                    distanceTraveled += Math.abs(tryNewPos[0] - newDesiredXPos);
                    remainingDeltaTime *= Math.max((1 - distanceTraveled / totalCurrentDistance), 0);

                    oldPos[0] = tryNewPos[0];
                    oldPos[1] = newDesiredYPos;
                    tryNewPos[1] = newDesiredYPos;

                    var speed = Math.sqrt(curVelX * curVelX + curVelY * curVelY);
                    if (Math.abs(curVelY) >= this.BOUNCE_SPEED) {
                        var changeInYVelAfterHit = (newVel[1] - oldVel[1]) * (remainingDeltaTime / deltaTime);
                        var desiredYVel = -curVelY * this.RESTITUTION;
                        oldVel[1] = desiredYVel;
                        newVel[1] = desiredYVel + changeInYVelAfterHit;
                    } else {
                        oldVel[1] = 0;
                        newVel[1] = 0;
                        this.isOnGround = true;
                    }
                }
            } else {
                remainingDeltaTime = 0;
            }
        } while (remainingDeltaTime > this.TOLERANCE);

        newPos[0] = tryNewPos[0];
        newPos[1] = tryNewPos[1];
    };

    this.applyForces = function(newVel, oldPos, oldVel, deltaTime) {
        var player = Game.PlayerManager.player;
        var oldWorldSide = this.calculateWorldSide(oldPos, oldVel);
        var velAddX = 0;
        var velAddY = 0;
        if (Game.GameInput.keysDown[Game.GameInput.KEY_A]) {
            velAddX -= this.ACCEL * deltaTime;
        }
        if (Game.GameInput.keysDown[Game.GameInput.KEY_D]) {
            velAddX += this.ACCEL * deltaTime;
        }

        if (Game.GameInput.keysDown[Game.GameInput.KEY_W]/* && this.isOnGround*/) {
            velAddY += oldWorldSide * this.JUMP_ACCEL;
            this.isOnGround = false;
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

        if (Math.abs(newVel[1]) < this.TOLERANCE) {
            newVel[1] = 0;
        }

        newVel[1] -= oldWorldSide * this.GRAVITY * deltaTime;
    };

    this.getMillisToZero = function(oldPos, oldVel) {
        var worldSide = this.calculateWorldSide(oldPos, oldVel);
        //var newVel = vec3.fromValues(0, oldVel[1] - worldSide * this.GRAVITY * deltaTime);
        var a = -worldSide * 0.5 * this.GRAVITY;
        var b = oldVel[1];
        var c = oldPos[1];
        var quadFormNumeratorLeft = -b;
        var quadFormNumeratorRight = Math.sqrt(b * b - 4 * a * c);
        var quadFormDenominator = 2 * a;
        return Math.max((quadFormNumeratorLeft + quadFormNumeratorRight) / quadFormDenominator, (quadFormNumeratorLeft - quadFormNumeratorRight) / quadFormDenominator);
    };

    this.calculateWorldSide = function(pos, vel) {
        if (pos[1] < -this.TOLERANCE) {
            return -1;
        } else if (pos[1] > this.TOLERANCE) {
            return 1;
        }

        if (vel[1] < 0) {
            return -1;
        }

        return 1;
    };

    this.lineIntersection = function(line1, line2) {
        var p0_x = line1[0][0];
        var p0_y = line1[0][1];
        var p1_x = line1[1][0];
        var p1_y = line1[1][1];
        var p2_x = line2[0][0];
        var p2_y = line2[0][1];
        var p3_x = line2[1][0];
        var p3_y = line2[1][1];

        var s1_x, s1_y, s2_x, s2_y;
        s1_x = p1_x - p0_x;
        s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x;
        s2_y = p3_y - p2_y;

        var s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
        {
            // Collision detected
            return 1;
        }

        return 0; // No collision
    }

    this.pointOfIntersection = function(line1, line2) {
        var x1 = line1[0][0];
        var y1 = line1[0][1];
        var x2 = line1[1][0];
        var y2 = line1[1][1];
        var x3 = line2[0][0];
        var y3 = line2[0][1];
        var x4 = line2[1][0];
        var y4 = line2[1][1];

        var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
        if (d == 0) {
            return Number.NaN;
        }

        var xi = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
        var yi = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;

        return [xi, yi];
    }
};
