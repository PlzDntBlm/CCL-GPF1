import {GameObject} from "./GameObject.js";
import {myApp} from "../../../app.js";
import {Tile} from "./Tile.js";
import {Paddle} from "./Paddle.js";
import {Game} from "../core/Game.js";

export class Ball extends GameObject {
    constructor() {
        super();
        this.renderer.imageSrc = '/images/Ball8_0.png';
        this.renderer.drawMode = 'texture';
        this.renderer.redraw = true;
        this.renderer.image = new Image();
        this.renderer.image.src = myApp.assetsPath + this.renderer.imageSrc;
        this.speed = 0.08;
        this.velocity = {
            x: 0,
            y: -1
        }
        this.boundToPaddle = true;
        this.paddleOffset = 1;
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
        if (this.boundToPaddle) {
            this.transform.position.x = Game.Instance.paddle.transform.position.x - this.transform.sizeInPixel.x / 2 + Game.Instance.paddle.transform.sizeInPixel.x / 2;
            this.transform.position.y = Game.Instance.paddle.transform.position.y + this.paddleOffset;
        } else {
            this.transform.position.x = this.transform.position.x + this.velocity.x * this.speed * deltaTime;
            this.transform.position.y = this.transform.position.y + this.velocity.y * this.speed * deltaTime;
        }
        // Round positions after collision resolution
        //this.transform.position.x = Math.round(this.transform.position.x);
        //this.transform.position.y = Math.round(this.transform.position.y);

        // Update the collider position to match the new position of the ball
        this.collider.x = this.transform.position.x + this.collider.radius;
        this.collider.y = this.transform.position.y + this.collider.radius;


        if (!this.boundToPaddle) {
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

                this.subtractLife();
            }
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
        if (other instanceof Paddle) {
            let overlapY = (this.transform.position.y + this.transform.sizeInPixel.y) - other.transform.position.y;
            this.transform.position.y -= overlapY + 1; // Ensure separation

            // Only reverse the y-velocity if the ball is moving downwards
            if (this.velocity.y > 0) {
                this.velocity.y *= -1;
            }

            // Optional: Dynamic bounce off the paddle
            let hitPos = (this.transform.position.x + (this.transform.sizeInPixel.x / 2)) - (other.transform.position.x + (other.transform.sizeInPixel.x / 2));
            let influenceFactor = 0.02;
            this.velocity.x += hitPos * influenceFactor;
        } else if (other instanceof Tile && other.tile.destructible) {
            // Mark the tile for destruction
            other.toBeDestroyed = true;

            // Use the improved collision direction determination
            const collisionDirection = this.determineCollisionDirection(this, other);
            if (collisionDirection === 'horizontal') {
                this.velocity.x *= -1;
            } else if (collisionDirection === 'vertical') {
                this.velocity.y *= -1;
            }
        }
    }

    subtractLife() {
        this.boundToPaddle = true;
        this.velocity.x = 0;
        this.velocity.y = 0;
        Game.Instance.lifeMinus();
    }

    determineCollisionDirection(ball, tile) {
        // Get the center positions of the ball and tile
        const ballCenterX = ball.transform.position.x + ball.transform.sizeInPixel.x / 2;
        const ballCenterY = ball.transform.position.y + ball.transform.sizeInPixel.y / 2;
        const tileCenterX = tile.transform.position.x + tile.transform.sizeInPixel.x / 2;
        const tileCenterY = tile.transform.position.y + tile.transform.sizeInPixel.y / 2;

        // Calculate differences
        const dx = ballCenterX - tileCenterX;
        const dy = ballCenterY - tileCenterY;

        // Use the dimensions of the tile to scale these differences
        const widthScaled = dx * (tile.transform.sizeInPixel.y / tile.transform.sizeInPixel.x);
        const heightScaled = dy * (tile.transform.sizeInPixel.x / tile.transform.sizeInPixel.y);

        // Determine the primary direction of the collision based on the scaled differences
        if (Math.abs(widthScaled) > Math.abs(heightScaled)) {
            return 'horizontal';
        } else {
            return 'vertical';
        }
    }


    Render() {
        myApp.context.drawImage(this.renderer.image, Math.round(this.transform.position.x), Math.round(this.transform.position.y), this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
    }
}