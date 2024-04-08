export class Rigidbody {
    constructor(mass, gravityScale, drag = 0) {
        this.mass = mass;
        this.gravityScale = gravityScale;
        this.drag = drag;
        // Initial velocity set to zero
        this.velocity = {x: 0, y: 0};
        // Flag to check if the object is on the ground
        this.isGrounded = false;
        // Terminal velocity, positive for downward speed to match gravity's direction
        this.terminalVelocity = 9.81; // Adjust as needed
        // Transform to track the position of the object
        this.transform = {
            position: {x: 0, y: 0}
        };
    }

    applyGravity(deltaTime) {
        if (!this.isGrounded) {
            // Apply gravity force
            this.velocity.y += 9.81 * this.gravityScale * deltaTime;
            // Clamp the downward velocity to not exceed the terminal velocity
            if (this.velocity.y > this.terminalVelocity) {
                this.velocity.y = this.terminalVelocity;
            }
        }
    }

    applyForce(force) {
        this.velocity.x += force.x / this.mass;
        this.velocity.y += force.y / this.mass;
    }

    applyDrag(deltaTime) {
        // Apply drag only if the object is not grounded
        if (!this.isGrounded) {
            const dragForce = this.drag * deltaTime;
            this.velocity.x -= dragForce * this.velocity.x;
            this.velocity.y -= dragForce * this.velocity.y;

            // Ensure velocity is set to 0 if it's too small to prevent drift
            if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
            if (Math.abs(this.velocity.y) < 0.01) this.velocity.y = 0;
        }

        // Threshold for stopping completely to avoid floating-point drift
        //if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
        //if (Math.abs(this.velocity.y) < 0.01) this.velocity.y = 0;
    }

    Update(deltaTime) {
        // Apply gravity
        this.applyGravity(deltaTime);

        // Apply drag
        this.applyDrag(deltaTime);

        // Update position based on velocity
        this.transform.position.x += this.velocity.x * deltaTime;
        this.transform.position.y += this.velocity.y * deltaTime;

        // Optionally, round positions if required for pixel-perfect placement
        //this.transform.position.x = Math.round(this.transform.position.x);
        //this.transform.position.y = Math.round(this.transform.position.y);
    }
}
