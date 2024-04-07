import {GameObject} from "./GameObject.js";
import {myApp} from "../../../app.js";
import {Rigidbody} from "./Rigidbody.js";
import {AABB} from "../utils/collider/AABB.js";
import {Tile} from "./Tile.js";

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
        this.rigidbody = new Rigidbody(1, 0.0005); //0.001
        this.rigidbody.transform.position = {...this.transform.position};
        console.log("Assigned Ball position to Rigidbody");
        this.transform.previousPosition = {
            x: this.rigidbody.transform.position.x,
            y: this.rigidbody.transform.position.y
        }
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
    OnCollision(other, collisionPoint) {
        if (other instanceof Tile && other.collider instanceof AABB) {
            this.rigidbody.gravityScale = 0;
            // Reverse the velocity as a simple response
            this.rigidbody.velocity.x = -this.rigidbody.velocity.x;
            this.rigidbody.velocity.y = -this.rigidbody.velocity.y;

            // Calculate the overlap between the ball and the tile
            const overlapX = (this.collider.radius + other.collider.width / 2) - Math.abs(this.transform.previousPosition.x - (other.collider.x + other.collider.width / 2));
            const overlapY = (this.collider.radius + other.collider.height / 2) - Math.abs(this.transform.previousPosition.y - (other.collider.y + other.collider.height / 2));

            // Reposition the ball outside of the tile's bounds by adjusting its position based on the overlap
            if (overlapX < overlapY) {
                // Horizontal collision
                this.transform.position.x = this.transform.previousPosition.x + (overlapX + 1) * Math.sign(this.rigidbody.velocity.x);
            } else {
                // Vertical collision
                this.transform.position.y = this.transform.previousPosition.y + (overlapY + 1) * Math.sign(this.rigidbody.velocity.y);
            }

            // Update the collider position to match the new position of the ball
            this.collider.x = this.transform.position.x;
            this.collider.y = this.transform.position.y;
        }
    }

    Render() {
        this.transform.position.x = Math.round(this.transform.position.x);
        this.transform.position.y = Math.round(this.transform.position.y);

        myApp.context.drawImage(this.renderer.image, this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
    }
}