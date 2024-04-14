import {GameObject} from "./GameObject.js";
import {myApp} from "../../../app.js";
import {AABB} from "../utils/collider/AABB.js";
import {Rigidbody} from "./Rigidbody.js";
import {Tile} from "./Tile.js";
import {Game} from "../core/Game.js";

export class Paddle extends GameObject {
    constructor() {
        super();
        //this.setTileType(data.tile.type);
        this.renderer.drawMode = 'texture';
        this.renderer.imageSrc = 'images/Paddle_0.png';

        this.transform.sizeInPixel.x = 16 * 3;
        this.transform.sizeInPixel.y = 8;
        this.transform.position.x = (myApp.canvas.width / 2) - (this.transform.sizeInPixel.x / 2);
        this.transform.position.y = myApp.canvas.height - 16;

        this.collider = new AABB(this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);

        this.bot = {
            inputMinTime: 20,
            inputMaxTime: 250,
            inputMinTimeOut: 50,
            inputMaxTimeOut: 1000,
            nextInputDate: null
        };
        this.bot.inputMinTime = 250;
        this.bot.inputMinTimeOut = 50;
        this.bot.inputMaxTimeOut = 1000;
        this.bot.nextInputDate = null;

        this.acceleration = 200;
        this.maxSpeed = 0.2;
    }

    Init() {
        this.rigidbody = new Rigidbody(1, 0);
        this.rigidbody.drag = 0.01;
        this.rigidbody.terminalVelocity = 0;
        this.rigidbody.isGrounded = true;
        this.rigidbody.transform.position = {...this.transform.position};
        console.log("Assigned Rigidbody position to Paddle");
        this.transform.previousPosition = {
            x: this.rigidbody.transform.position.x,
            y: this.rigidbody.transform.position.y
        }
    }

    // Example modification to the OnCollision method or collision handling logic
    OnCollision(other) {
        if (other instanceof Tile) {
            const overlap = this.calculateOverlap(this, other);
            this.correctPositionBasedOnOverlap(this, other, overlap);

            // Neutralize velocity towards the tile
            this.rigidbody.velocity.x = 0;

            // Ignore further input in the collision direction for a brief period
            // Determine direction based on overlap; if overlap is negative, collision was towards the right
            this.ignoreInputDirection = overlap.x < 0 ? 'right' : 'left';
            this.ignoreInputUntil = Date.now() + 200; // Ignore input for 200ms
        }
    }


    calculateOverlap(paddle, tile) {
        // Assuming AABB collision detection for both paddle and tile
        const paddleRight = paddle.collider.x + paddle.collider.width;
        const paddleLeft = paddle.collider.x;
        const tileRight = tile.collider.x + tile.collider.width;
        const tileLeft = tile.collider.x;

        // Calculate horizontal overlap
        const overlapRight = paddleRight - tileLeft;
        const overlapLeft = tileRight - paddleLeft;

        return {
            x: overlapRight < overlapLeft ? -overlapRight : overlapLeft, // Negative overlap for rightward collisions
        };
    }

    correctPositionBasedOnOverlap(paddle, tile, overlap) {
        // Correct paddle position based on overlap
        paddle.transform.position.x += overlap.x;

        // After adjusting the position, ensure the collider is also updated
        paddle.collider.x = paddle.transform.position.x;
    }


    Update(deltaTime) {
        this.transform.previousPosition = this.transform.position;

        this.rigidbody.Update(deltaTime);

        //this.rigidbody.Update(deltaTime);
        this.transform.position.x = this.rigidbody.transform.position.x;
        this.transform.position.y = this.rigidbody.transform.position.y;

        // // Round positions after collision resolution
        // this.transform.position.x = Math.round(this.transform.position.x);
        // this.transform.position.y = Math.round(this.transform.position.y);

        this.updateColliderPosition();
    }

    Render() {
        try {
            const img = new Image();
            img.src = myApp.assetsPath + this.renderer.imageSrc;
            myApp.context.drawImage(img, Math.round(this.transform.position.x), Math.round(this.transform.position.y), this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
        } catch (e) {
            console.error(e);
        }
    }

    moveLeft() {
        if (this.rigidbody.velocity.x > 0) {
            this.rigidbody.velocity.x = 0;
        } else {
            this.rigidbody.applyForce({x: -this.acceleration, y: 0});
            // Clamp the velocity.x between -5 and 5
            this.rigidbody.velocity.x = Math.max(-this.maxSpeed, Math.min(this.rigidbody.velocity.x, this.maxSpeed));
        }
    }

    moveRight() {
        if (this.rigidbody.velocity.x < 0) {
            this.rigidbody.velocity.x = 0;
        } else {
            this.rigidbody.applyForce({x: this.acceleration, y: 0});
            // Clamp the velocity.x between -5 and 5
            this.rigidbody.velocity.x = Math.max(-this.maxSpeed, Math.min(this.rigidbody.velocity.x, this.maxSpeed));
        }
    }

    HandleInput() {
        if (myApp.debug.paddleBot) {
            if (Date.now() < this.ignoreInputUntil) {

            } else {
                this.paddleBot()
            }
        } else {
            if (Date.now() < this.ignoreInputUntil && this.ignoreInputDirection === 'left' && Game.Instance.Keys.ArrowLeft) {
                // Ignore left input
            } else if (Date.now() < this.ignoreInputUntil && this.ignoreInputDirection === 'right' && Game.Instance.Keys.ArrowRight) {
                // Ignore right input
            } else {
                // Handle input normally
                // Assuming left/right movement
                if (Game.Instance.Keys.ArrowLeft) {
                    this.moveLeft();
                } else if (Game.Instance.Keys.ArrowRight) {
                    this.moveRight();
                }
            }
        }
        if (Game.Instance.Keys.Space) {
            if (Game.Instance.ball.boundToPaddle) {
                Game.Instance.ball.boundToPaddle = false;
                Game.Instance.ball.velocity.y = -1;
            }
        }
    }

    paddleBot() {
        // Check if it's time for the next input
        const ballCenter = Game.Instance.ball.transform.position.x + (Game.Instance.ball.transform.sizeInPixel.x / 2);
        const paddleCenter = this.transform.position.x + (this.transform.sizeInPixel.x / 2);

        // Enhanced Movement Logic: Check for screen boundaries
        const atLeftEdge = this.transform.position.x <= 16;
        const atRightEdge = this.transform.position.x + this.transform.sizeInPixel.x >= myApp.canvas.width - 16;
        if (this.bot.nextInputDate === null || Date.now() > this.bot.nextInputDate) {

            if (!atLeftEdge && ballCenter < paddleCenter) {
                this.applySustainedForce('left');
            } else if (!atRightEdge && ballCenter > paddleCenter) {
                this.applySustainedForce('right');
            }

            // Improved Decision-making: Adjust bot behavior based on position
            // If at edges, consider slightly moving away from the edge
            if (atLeftEdge && ballCenter > paddleCenter) {
                this.applySustainedForce('right');
            } else if (atRightEdge && ballCenter < paddleCenter) {
                this.applySustainedForce('left');
            }

            // Reset or adjust force application based on current action and position
            this.scheduleNextInput();
        }

        // Continuously apply force if within the force application period
        if (this.forceDirection && Date.now() < this.forceEndTime) {
            if (this.forceDirection === 'right' && !atRightEdge) {
                this.moveRight();
            } else if (this.forceDirection === 'left' && !atLeftEdge) {
                this.moveLeft();
            }
        }
    }

    applySustainedForce(direction) {
        this.forceDirection = direction;
        // Set the duration for which the force will be applied
        const forceDuration = 500; // Force is applied for 500 milliseconds
        this.forceEndTime = Date.now() + forceDuration;
    }

    scheduleNextInput() {
        const timeUntilNextInput = Math.random() * (this.bot.inputMaxTime - this.bot.inputMinTime) + this.bot.inputMinTime;
        const timeoutDuration = Math.random() * (this.bot.inputMaxTimeOut - this.bot.inputMinTimeOut) + this.bot.inputMinTimeOut;
        this.bot.nextInputDate = Date.now() + timeUntilNextInput + timeoutDuration;
    }

    updateColliderPosition() {
        // Update the collider position to match the new position of the paddle
        this.collider.x = this.transform.position.x;
        this.collider.y = this.transform.position.y;
    }
}