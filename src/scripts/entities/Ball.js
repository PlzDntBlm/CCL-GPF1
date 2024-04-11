import {GameObject} from "./GameObject.js";
import {myApp} from "../../../app.js";
import {Rigidbody} from "./Rigidbody.js";
import {AABB} from "../utils/collider/AABB.js";
import {Tile} from "./Tile.js";
import {Paddle} from "./Paddle.js";
import {Game} from "../core/Game.js";

export class Ball extends GameObject {
    constructor() {
        super();
        this.renderer.imageSrc = '/images/Ball_0.png';
        this.renderer.drawMode = 'texture';
        this.renderer.redraw = true;
        this.renderer.image = new Image();
        this.renderer.image.src = myApp.assetsPath + this.renderer.imageSrc;
        this.speed = 0.08;
        this.velocity = {
            x: 1,
            y: 1
        }
        console.log("Loaded Ball Image");

        this.solid = true;
        console.log("Constructed Ball");
    }

    Init() {
        //this.rigidbody = new Rigidbody(1, 0.0005); //0.001
        //this.rigidbody.transform.position = {...this.transform.position};
        console.log("Assigned Ball position to Rigidbody");
        this.transform.previousPosition = {
            x: this.transform.position.x,
            y: this.transform.position.y
        }
    }

    Update(deltaTime) {
        this.transform.previousPosition = this.transform.position;

        this.transform.position.x = this.transform.position.x + this.velocity.x * this.speed * deltaTime;
        this.transform.position.y = this.transform.position.y + this.velocity.y * this.speed * deltaTime;
        // Round positions after collision resolution
        //this.transform.position.x = Math.round(this.transform.position.x);
        //this.transform.position.y = Math.round(this.transform.position.y);

        // Update the collider position to match the new position of the ball
        this.collider.x = this.transform.position.x + this.collider.radius;
        this.collider.y = this.transform.position.y + this.collider.radius;


        // Handle Y-axis boundaries (top and bottom)
        if (this.transform.position.y - 16 <= 0) {
            // Calculate overlap
            let overlap = Math.abs(this.transform.position.y - 16);
            // Reposition just inside the boundary
            this.transform.position.y += overlap;
            // Then reverse velocity
            this.velocity.y *= -1;
        } else if (this.transform.position.y + this.transform.sizeInPixel.y >= myApp.canvas.height) {
            // Calculate overlap
            let overlap = Math.abs((this.transform.position.y + this.transform.sizeInPixel.y) - myApp.canvas.height);
            // Reposition just inside the boundary
            this.transform.position.y -= overlap;
            // Then reverse velocity
            this.velocity.y *= -1;
        }


        // Handle X-axis boundaries (left and right)
        if (this.transform.position.x <= 16) {
            // Calculate overlap; assuming the ball's position is at its center,
            // you might need to adjust this calculation based on your positioning logic.
            let overlap = 16 - this.transform.position.x;
            // Reposition just inside the boundary
            this.transform.position.x += overlap;
            // Then reverse velocity
            this.velocity.x *= -1;
        } else if (this.transform.position.x + this.transform.sizeInPixel.x >= myApp.canvas.width - 16) {
            // Calculate overlap
            let overlap = (this.transform.position.x + this.transform.sizeInPixel.x) - (myApp.canvas.width - 16);
            // Reposition just inside the boundary
            this.transform.position.x -= overlap;
            // Then reverse velocity
            this.velocity.x *= -1;
        }

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
        if (other instanceof Tile) {

        }
        // In the OnCollision method for the Ball, when colliding with the Paddle
        if (other instanceof Paddle) {
            let overlap = (this.transform.position.y + this.transform.sizeInPixel.y) - (Game.Instance.paddle.transform.position.y);
            // Reposition just inside the boundary
            this.transform.position.x -= overlap;
            // Then reverse velocity
            this.velocity.y *= -1;
        }
    }

    Render() {
        myApp.context.drawImage(this.renderer.image, Math.round(this.transform.position.x), Math.round(this.transform.position.y), this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
    }
}