import {GameObject} from "./GameObject.js";
import {TileSet} from "../scenes/Tilemaps/TileSet.js";
import {myApp} from "../../../app.js";
import {GameLoop} from "../core/GameLoop.js";
import {AABB} from "../utils/collider/AABB.js";
import {Rigidbody} from "./Rigidbody.js";
import {Tile} from "./Tile.js";

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

        this.acceleration = 100;
        this.maxSpeed = 0.1;
    }

    Init() {
        this.rigidbody = new Rigidbody(1, 0);
        this.rigidbody.terminalVelocity = 0;
        this.rigidbody.isGrounded = true;
        this.rigidbody.transform.position = {...this.transform.position};
        console.log("Assigned Rigidbody position to Paddle");
        this.transform.previousPosition = {
            x: this.rigidbody.transform.position.x,
            y: this.rigidbody.transform.position.y
        }
    }

    OnCollision(other) {
        if (other instanceof Tile) {
            // Assuming `other` has a method to get its boundaries: left, right, top, bottom
            const tileLeft = other.x;
            const tileRight = other.x + other.width;
            const tileTop = other.y;
            const tileBottom = other.y + other.height;

            // Paddle's current position
            const paddleLeft = this.transform.position.x;
            const paddleRight = this.transform.position.x + this.transform.sizeInPixel.x;
            const paddleTop = this.transform.position.y;
            const paddleBottom = this.transform.position.y + this.transform.sizeInPixel.y;

            // Assuming the paddle is moving horizontally only
            if (this.rigidbody.velocity.x > 0) { // Moving right
                // If the paddle's left side is colliding with the tile's right side
                if (paddleLeft < tileRight && paddleRight > tileRight) {
                    this.transform.position.x = tileRight; // Place the paddle to the right of the tile
                }
            } else if (this.rigidbody.velocity.x < 0) { // Moving left
                // If the paddle's right side is colliding with the tile's left side
                if (paddleRight > tileLeft && paddleLeft < tileLeft) {
                    this.transform.position.x = tileLeft - this.transform.sizeInPixel.x; // Place the paddle to the left of the tile
                }
            }

            // Stop the paddle's movement as it has collided with a tile
            this.rigidbody.velocity.x = 0;
        }
    }


    Update(deltaTime) {
        this.transform.previousPosition = this.transform.position;

        this.rigidbody.Update(deltaTime);

        // Other player updates such as handling input
        // ...
        //this.handleInput();

        //this.rigidbody.Update(deltaTime);
        this.transform.position.x = this.rigidbody.transform.position.x;
        this.transform.position.y = this.rigidbody.transform.position.y;

        // // Round positions after collision resolution
        this.transform.position.x = Math.round(this.transform.position.x);
        this.transform.position.y = Math.round(this.transform.position.y);

        // Update the collider position to match the new position of the paddle
        this.collider.x = this.transform.position.x;
        this.collider.y = this.transform.position.y;
    }

    Render() {
        try {
            const img = new Image();
            img.src = myApp.assetsPath + this.renderer.imageSrc;
            myApp.context.drawImage(img, this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
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

}