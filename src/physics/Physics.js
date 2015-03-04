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
                /*
                var xDist;
                var yDist;
                var widthTolerance = 2;
                //moving to the right
                if (tryNewPos[0] > oldPos[0]) {
                    //can get to the min vertex
                    if (colMinVertex[0] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance) > oldPos[0]) {
                        xDist = colMinVertex[0] - oldPos[0] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    } else {
                        xDist = colMaxVertex[0] - oldPos[0] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    }
                //moving to the left
                } else {
                    if (colMaxVertex[0] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance) < oldPos[0]) {
                        xDist = oldPos[0] - colMaxVertex[0] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    } else {
                        xDist = oldPos[0] - colMinVertex[0] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    }
                }
                //moving down
                if (tryNewPos[1] > oldPos[1]) {
                    //can get to the min vertex
                    if (colMinVertex[1] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance) > oldPos[1]) {
                        yDist = colMinVertex[1] - oldPos[1] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    } else {
                        yDist = colMaxVertex[1] - oldPos[1] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    }
                //moving up
                } else {
                    if (colMaxVertex[1] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance) < oldPos[1]) {
                        yDist = oldPos[1] - colMaxVertex[1] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    } else {
                        yDist = oldPos[1] - colMinVertex[1] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance);
                    }
                }


                var hitHorizontal = false;
                var hitVertical = false;
                var changeX = tryNewPos[0] - oldPos[0];
                var changeY = tryNewPos[1] - oldPos[1];
                if (Math.abs(changeX) < this.TOLERANCE) {
                    hitHorizontal = true
                } else if (Math.abs(changeY) < this.TOLERANCE) {
                    hitVertical = true;
                    console.log(1);
                } else {
                    var xDistToYDistMult = changeY / changeX;
                    var xCorrespondingY = xDist * xDistToYDistMult;
                    var xDistYPos = oldPos[1] + xCorrespondingY * Math.abs(changeX) / changeX;

                    //if it doesnt hit the boundaries of the vertical side
                    if (xDistYPos > colMaxVertex[1] + Game.PlayerManager.PLAYER_WIDTH / 2 || xDistYPos < colMinVertex[1] - Game.PlayerManager.PLAYER_WIDTH / 2) {
                        hitHorizontal = true;
                    } else {
                        var yDistToXDistMult = changeX / changeY;
                        var yCorrespondingX = yDist * yDistToXDistMult;
                        var yDistXPos = oldPos[0] + yCorrespondingX * Math.abs(changeY) / changeY;

                        //if it doesnt hit the boundaries of the horizontal side
                        if (yDistXPos > colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2 || yDistXPos < colMinVertex[0] - Game.PlayerManager.PLAYER_WIDTH / 2) {
                            hitVertical = true;
                            console.log(2);
                        } else {
                            var yDistDistance = Math.sqrt(xDist * xDist + xCorrespondingY * xCorrespondingY);
                            var xDistDistance = Math.sqrt(yDist * yDist + yCorrespondingX * yCorrespondingX);
                            console.log(xDistDistance + ' - ' + yDistDistance);

                            if (xDistDistance > yDistDistance) {
                                hitVertical = true;
                                console.log(3);
                            } else {
                                hitHorizontal = true;
                                console.log('test');
                            }
                        }
                    }
                }
                */

                var widthTolerance = 0;
                var lineTop = [
                    [colMinVertex[0] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance), colMinVertex[1] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)],
                    [colMaxVertex[0] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance), colMinVertex[1] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)]
                ];
                var lineRight = [
                    [colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2, colMinVertex[1] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)],
                    [colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2, colMaxVertex[1] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)]
                ];
                var lineBottom = [
                    [colMinVertex[0] - Game.PlayerManager.PLAYER_WIDTH / 2, colMaxVertex[1] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)],
                    [colMaxVertex[0] + Game.PlayerManager.PLAYER_WIDTH / 2, colMaxVertex[1] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)]
                ];
                var lineLeft = [
                    [colMinVertex[0] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance), colMinVertex[1] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)],
                    [colMinVertex[0] - (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance), colMaxVertex[1] + (Game.PlayerManager.PLAYER_WIDTH / 2 - widthTolerance)]
                ];

                var guyVelLine = [
                    [oldPos[0], oldPos[1]],
                    [tryNewPos[0], tryNewPos[1]]
                ];

                var hitHorizontal = false;
                var hitVertical = false;
                if (this.lineIntersection(lineTop, guyVelLine) || this.lineIntersection(lineBottom, guyVelLine)) {
                    hitHorizontal = true;
                } else if (this.lineIntersection(lineRight, guyVelLine) || this.lineIntersection(lineLeft, guyVelLine)) {
                    hitVertical = true;
                }

                var totalCurrentDistance = Math.sqrt(addDistX * addDistX + addDistY * addDistY);

                var curVelX = oldVel[0] + (newVel[0] - oldVel[0]) * remainingDeltaTime / deltaTime;
                var curVelY = oldVel[1] + (newVel[1] - oldVel[1]) * remainingDeltaTime / deltaTime;

                if (hitVertical) {
                    var xDir = Math.abs(addDistX) / addDistX;
                    var backupAmountX = xDir * (insideAmountX + 0.1);
                    var xToYMult = Math.sin(guyVelAngle) / Math.cos(guyVelAngle);

                    var newDesiredXPos = tryNewPos[0] - backupAmountX;
                    var newDesiredYPos = tryNewPos[1] - backupAmountX * xToYMult;

                    var distanceTraveledX = newDesiredXPos - oldPos[0];
                    var distanceTraveledY = newDesiredYPos - oldPos[1];
                    var distanceTraveled = Math.sqrt(distanceTraveledX * distanceTraveledX + distanceTraveledY * distanceTraveledY);
                    remainingDeltaTime *= (1 - distanceTraveled / totalCurrentDistance);

                    oldPos[0] = newDesiredXPos;
                    oldPos[1] = newDesiredYPos;

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
                    var backupAmountY = yDir * (insideAmountY + this.TOLERANCE);
                    var yToXMult = Math.cos(guyVelAngle) / Math.sin(guyVelAngle);

                    var newDesiredXPos = tryNewPos[0] - backupAmountY * yToXMult;
                    var newDesiredYPos = tryNewPos[1] - backupAmountY;//TODO might have to add a little to keep it from colliding again

                    var distanceTraveledX = newDesiredXPos - oldPos[0];
                    var distanceTraveledY = newDesiredYPos - oldPos[1];
                    var distanceTraveled = Math.sqrt(distanceTraveledX * distanceTraveledX + distanceTraveledY * distanceTraveledY);
                    remainingDeltaTime *= (1 - distanceTraveled / totalCurrentDistance);

                    oldPos[0] = newDesiredXPos;
                    oldPos[1] = newDesiredYPos;

                    var speed = Math.sqrt(curVelX * curVelX + curVelY * curVelY);
                    if (Math.abs(curVelY) >= this.BOUNCE_SPEED) {
                        var changeInYVelAfterHit = (newVel[1] - oldVel[1]) * (remainingDeltaTime / deltaTime);
                        //TODO physics is slightly wrong if he hits a person and then bounces and the same tick ends up on the opposite side of the zero line
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

        if (Game.GameInput.keysDown[Game.GameInput.KEY_W] && this.isOnGround) {
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
};
