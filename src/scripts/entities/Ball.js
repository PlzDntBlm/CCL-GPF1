import {GameObject} from "./GameObject.js";
import {myApp} from "../../../app.js";
import {Rigidbody} from "./Rigidbody.js";
import {AABB} from "../utils/collider/AABB.js";
import {Tile} from "./Tile.js";
import {Paddle} from "./Paddle.js";

export class Ball extends GameObject {
    constructor() {
        super();
        this.renderer.imageSrc = '/images/Ball_0.png';
        this.renderer.drawMode = 'texture';
        this.transform.sizeInPixel.x = 16;
        this.transform.sizeInPixel.y = 16;
        this.renderer.redraw = true;
        this.renderer.image = new Image();
        this.renderer.image.src = myApp.assetsPath + this.renderer.imageSrc;
        console.log("Loaded Ball Image");

        this.solid = true;
        console.log("Constructed Ball");
    }

    Init() {
        this.rigidbody = new Rigidbody(1, 0); //0.001
        this.rigidbody.transform.position = {...this.transform.position};
        console.log("Assigned Ball position to Rigidbody");
        this.transform.previousPosition = {
            x: this.rigidbody.transform.position.x,
            y: this.rigidbody.transform.position.y
        }
        this.rigidbody.applyForce({x: -0.01, y: -0.01});
    }

    Update(deltaTime) {
        this.transform.previousPosition = this.transform.position;
        this.rigidbody.isGrounded = false;
        // Update the Rigidbody's physics
        this.rigidbody.Update(deltaTime);

        // Other player updates such as handling input
        // ...
        //this.handleInput();

        //this.rigidbody.Update(deltaTime);
        this.transform.position.x = this.rigidbody.transform.position.x;
        this.transform.position.y = this.rigidbody.transform.position.y;

        // Round positions after collision resolution
        this.transform.position.x = Math.round(this.transform.position.x);
        this.transform.position.y = Math.round(this.transform.position.y);

        // Update the collider position to match the new position of the ball
        this.collider.x = this.transform.position.x + this.collider.radius;
        this.collider.y = this.transform.position.y + this.collider.radius;


        // Handle collisions
        // ...
    }

    // In Ball.js's OnCollision method
    // OnCollision(other, collisionPoint) {
    //     if (other instanceof Tile && other.collider instanceof AABB) {
    //         this.rigidbody.gravityScale = 0;
    //         // Reverse the velocity as a simple response
    //         this.rigidbody.velocity.x = -this.rigidbody.velocity.x;
    //         this.rigidbody.velocity.y = -this.rigidbody.velocity.y;
    //
    //         // Calculate the overlap between the ball and the tile
    //         const overlapX = (this.collider.radius + other.collider.width / 2) - Math.abs(this.transform.previousPosition.x - (other.collider.x + other.collider.width / 2));
    //         const overlapY = (this.collider.radius + other.collider.height / 2) - Math.abs(this.transform.previousPosition.y - (other.collider.y + other.collider.height / 2));
    //
    //         // Reposition the ball outside of the tile's bounds by adjusting its position based on the overlap
    //         if (overlapX < overlapY) {
    //             // Horizontal collision
    //             this.transform.position.x = this.transform.previousPosition.x + (overlapX + 1) * Math.sign(this.rigidbody.velocity.x);
    //         } else {
    //             // Vertical collision
    //             this.transform.position.y = this.transform.previousPosition.y + (overlapY + 1) * Math.sign(this.rigidbody.velocity.y);
    //         }
    //
    //         // Update the collider position to match the new position of the ball
    //         this.collider.x = this.transform.position.x;
    //         this.collider.y = this.transform.position.y;
    //     }
    // }

    OnCollision(other, collisionPoint) {
        this.rigidbody.gravityScale = 0;
        if (other instanceof Tile) {
            // Determine if the collision is more horizontal or vertical
            // Assuming you have a way to calculate or store the last movement direction
            if (Math.abs(this.rigidbody.velocity.x) > Math.abs(this.rigidbody.velocity.y)) {
                // Horizontal collision
                this.rigidbody.velocity.x *= -1;
            } else {
                // Vertical collision
                this.rigidbody.velocity.y *= -1;
            }

            // Destroy the tile if it's a brick
            if (other.isBrick) {
                other.destroy();
            }
        }
        // In the OnCollision method for the Ball, when colliding with the Paddle
        if (other instanceof Paddle) {
            // Reverse y-velocity for the bounce
            this.rigidbody.velocity.y *= -1;

            // Adjust x-velocity based on collision point
            let hitPos = this.transform.position.x - other.transform.position.x; // Relative hit position
            let normalizedHitPos = (hitPos / (other.width / 2)); // Normalize based on paddle width
            this.rigidbody.velocity.x += normalizedHitPos * this.bounceSpeedModifier; // Adjust x-velocity
        }
    }

    Render() {
        this.transform.position.x = Math.round(this.transform.position.x);
        this.transform.position.y = Math.round(this.transform.position.y);

        myApp.context.drawImage(this.renderer.image, this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
    }
}