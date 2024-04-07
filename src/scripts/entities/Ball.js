import {GameObject} from "./GameObject.js";
import {myApp} from "../../../app.js";
import {Rigidbody} from "./Rigidbody.js";
import {AABB} from "../utils/collider/AABB.js";

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
        this.rigidbody = new Rigidbody(1, 0.001); //0.001
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

        // Update the collider position to match the new position of the ball
        this.collider.x = this.transform.position.x + this.collider.radius;
        this.collider.y = this.transform.position.y + this.collider.radius;


        // Handle collisions
        // ...
    }

    OnCollision(other) {
        // Simple response: reverse the ball's velocity
        // This is a placeholder; you'll need more complex logic for a real game
        if (other instanceof AABB) {
            // Assume a vertical bounce for simplicity
            this.rigidbody.velocity.y *= -1;
            console.error("AaAAA")
        }
    }

    Render() {
        myApp.context.drawImage(this.renderer.image, this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
    }
}