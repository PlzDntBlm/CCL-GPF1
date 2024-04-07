export class Rigidbody {
    constructor(mass, gravityScale) {
        this.mass = mass;
        this.gravityScale = gravityScale;
        this.velocity = {x: 0, y: 0};
        this.isGrounded = false;
        this.terminalVelocity = -1; // The negative value represents downward speed.
        this.transform = {
            position: {
                x: 0,
                y: 0
            }
        }
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    applyGravity() {
        if (!this.isGrounded) {
            this.velocity.y += 9.81 * this.gravityScale; // Apply gravity force
            // Clamp the velocity to not exceed the terminal velocity
            this.velocity.y = Math.min(this.velocity.y, -this.terminalVelocity);
        }
    }

    applyForce(force) {
        this.velocity.x += force.x / this.mass;
        this.velocity.y += force.y / this.mass;
        // If we are applying a force upwards we might also want to clamp the upward speed
        if (force.y < 0) {
            this.velocity.y = Math.min(this.velocity.y, -this.terminalVelocity);
        }
    }

    Update(deltaTime) {
        // Update position based on velocity
        this.transform.position.x += this.velocity.x * deltaTime;
        this.transform.position.y += this.velocity.y * deltaTime;

        // Apply gravity each frame
        this.applyGravity();

        // Collision detection logic
        // ...
    }
}
