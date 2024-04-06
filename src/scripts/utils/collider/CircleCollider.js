import {Collider} from "./Collider.js";
import {myApp} from "../../../../app.js";

export class CircleCollider extends Collider {
    constructor(x, y, radius) {
        super(x, y, radius, radius); // Using super to set x, y, and using radius for both width and height for simplicity
        this.radius = radius;
    }

    // Checks if this Circle collides with another Circle
    intersectsCircle(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + other.radius;
    }

    // Checks if this Circle collides with an AABB
    intersectsAABB(aabb) {
        // Find the closest point on the AABB to the circle's center
        const closestX = Math.max(aabb.x, Math.min(this.x, aabb.x + aabb.width));
        const closestY = Math.max(aabb.y, Math.min(this.y, aabb.y + aabb.height));

        // Calculate the distance between the circle's center and this closest point
        const dx = this.x - closestX;
        const dy = this.y - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
        return (dx * dx + dy * dy) < (this.radius * this.radius);
    }

    // Method to draw the CircleCollider for debugging purposes
    draw() {
        myApp.context.beginPath();
        myApp.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        myApp.context.strokeStyle = 'blue';
        myApp.context.stroke();
    }
}
