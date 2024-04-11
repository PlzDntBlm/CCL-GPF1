import {GameObject} from "./GameObject.js";
import {TileSet} from "../scenes/Tilemaps/TileSet.js";
import {myApp} from "../../../app.js";
import {GameLoop} from "../core/GameLoop.js";
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

        this.acceleration = 200;
        this.maxSpeed = 0.2;
    }

    Init() {
        this.rigidbody = new Rigidbody(1, 0);
        this.rigidbody.drag = 0.008;
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
            // Tile boundaries
            const tileLeft = other.collider.x;
            const tileRight = other.collider.x + other.collider.width;
            const tileTop = other.collider.y;
            const tileBottom = other.collider.y + other.collider.height;

            // Paddle boundaries
            const paddleLeft = this.collider.x;
            const paddleRight = this.collider.x + this.collider.width;
            const paddleTop = this.collider.y;
            const paddleBottom = this.collider.y + this.collider.height;

            // Calculate overlap on both axes
            const overlapX = Math.min(paddleRight, tileRight) - Math.max(paddleLeft, tileLeft);
            const overlapY = Math.min(paddleBottom, tileBottom) - Math.max(paddleTop, tileTop);

            // Handle horizontal collision based on the direction of the paddle's movement
            if (this.rigidbody.velocity.x > 0) { // Moving right
                // Correct the paddle's position to eliminate the overlap, effectively pushing it out of the tile
                this.transform.position.x -= overlapX;
            } else if (this.rigidbody.velocity.x < 0) { // Moving left
                this.transform.position.x += overlapX;
            }

            // Optionally, stop the paddle's movement on collision
            // this.rigidbody.velocity.x = 0;
        }
    }


    Update(deltaTime) {
        this.HandleInput();
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

    HandleInput() {
        if (Game.Instance.Keys.ArrowLeft)
            this.moveLeft();
        else if (Game.Instance.Keys.ArrowRight)
            this.moveRight();
    }
}