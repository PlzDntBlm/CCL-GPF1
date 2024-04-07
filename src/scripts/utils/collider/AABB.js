import {Collider} from "./Collider.js";
import {myApp} from "../../../../app.js";

export class AABB extends Collider {
    // Checks if this AABB collides with another AABB
    intersects(other) {
        return (this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y);
    }

    // Checks if this AABB collides with a CircleCollider
    intersectsCircle(circle) {
        // Find the closest point on the AABB to the circle's center
        const closestX = Math.max(this.x, Math.min(circle.x, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(circle.y, this.y + this.height));

        // Calculate the distance between the circle's center and this closest point
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
        const distanceSquared = (dx * dx + dy * dy);
        const intersects = distanceSquared < (circle.radius * circle.radius);

        // If there is an intersection, calculate the exact collision point
        if (intersects) {
            const distance = Math.sqrt(distanceSquared);
            // collisionPoint is on the edge of the circle, in the direction of the closest point from the center
            let collisionPoint = {};
            // If the distance is zero, the collision point is the same as the closest point on the AABB
            if (distance === 0) {
                collisionPoint = {x: closestX, y: closestY};
            } else {
                collisionPoint = {
                    x: circle.x - (dx / distance) * circle.radius,
                    y: circle.y - (dy / distance) * circle.radius
                };
            }

            if (isNaN(collisionPoint.x) || isNaN(collisionPoint.y)) {
                this.promptCollisionDetails(collisionPoint);
            }
            return {intersects: true, collisionPoint};
        }

        // If no intersection, return intersects as false and collisionPoint as null
        return {intersects: false, collisionPoint: null};
    }

    // Update the position of the AABB
    updatePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    // Optionally, if your entities have velocity, you can include an update method
    update(velocity, deltaTime) {
        this.x += velocity.x * deltaTime;
        this.y += velocity.y * deltaTime;
    }


    // A method to draw the AABB for debugging purposes
    draw() {
        myApp.context.beginPath();
        myApp.context.rect(this.x, this.y, this.width, this.height);
        myApp.context.strokeStyle = 'red';
        myApp.context.stroke();
    }
}