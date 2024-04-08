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

        this.acceleration = 100;
        this.maxSpeed = 0.1;
    }

    Init() {
        this.rigidbody = new Rigidbody(1, 0,1);
        this.rigidbody.terminalVelocity = 0;
        this.rigidbody.isGrounded = false;
        this.rigidbody.transform.position = {...this.transform.position};
        console.log("Assigned Rigidbody position to Paddle");
        this.transform.previousPosition = {
            x: this.rigidbody.transform.position.x,
            y: this.rigidbody.transform.position.y
        }
    }

    OnCollision(other) {
        if (other instanceof Tile) {
            // Reset velocity to stop the paddle's movement upon collision
            this.rigidbody.velocity.x = 0;
        }
    }




    Update(deltaTime) {
        // Store the previous position
        this.transform.previousPosition = this.transform.position;

        // Update the paddle based on current forces and velocities
        this.rigidbody.Update(deltaTime);

        // Apply clamping to ensure the paddle doesn't exceed game boundaries
        const clampedX = Math.max(16, Math.min(this.transform.position.x, myApp.canvas.width - 16 - this.transform.sizeInPixel.x));

        // If clamping changed the position, ensure the paddle stops moving
        if (clampedX !== this.transform.position.x) {
            this.rigidbody.velocity.x = 0;
        }

        // Apply the clamped position to ensure the paddle stays within bounds
        this.transform.position.x = clampedX;

        // Update the paddle's and its collider's positions to keep everything in sync
        this.SyncPositionAndCollider();
    }

    SyncPositionAndCollider() {
        // Sync the paddle's rigidbody and collider positions with its transformed position
        this.rigidbody.transform.position.x = this.transform.position.x;
        this.collider.x = this.transform.position.x;
        // Assuming the y position doesn't change, but you can sync it here as well if needed
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
        console.warn("left")
        // Prevents moving left if paddle is at the left boundary
        if (this.transform.position.x <= 16) {
            this.rigidbody.velocity.x = 0;
            return;
        }

        // If trying to move left while moving right, stop the paddle first
        if (this.rigidbody.velocity.x > 0) {
            this.rigidbody.velocity.x = 0;
        }

        // Apply leftward force and clamp the velocity
        this.rigidbody.applyForce({x: -this.acceleration, y: 0});
        console.log(GameLoop.FrameCounter,"Apply Force")
        this.rigidbody.velocity.x = Math.max(-this.maxSpeed, Math.min(this.rigidbody.velocity.x, this.maxSpeed));
    }

    moveRight() {
        console.warn("right")
        // Prevents moving right if paddle is at the right game boundary
        if (this.transform.position.x >= myApp.canvas.width - 16 - this.transform.sizeInPixel.x) {
            this.rigidbody.velocity.x = 0;
            console.warn("Returning")
            return;
        }

        // If trying to move right while moving left, stop the paddle first
        if (this.rigidbody.velocity.x < 0) {
            this.rigidbody.velocity.x = 0;
        }

        // Apply rightward force and clamp the velocity
        this.rigidbody.applyForce({x: this.acceleration, y: 0});
        console.log(GameLoop.FrameCounter,"Apply Force")
        this.rigidbody.velocity.x = Math.max(-this.maxSpeed, Math.min(this.rigidbody.velocity.x, this.maxSpeed));
    }


    HandleInput() {
        if(Game.Instance.Input.Direction.Vector.x === -1){
            this.moveLeft();
        }else if(Game.Instance.Input.Direction.Vector.x === 1){
            this.moveRight();
        }
    }
}