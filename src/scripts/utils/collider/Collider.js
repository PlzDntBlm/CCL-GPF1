import {GameObjectManager} from "../../entities/GameObjectManager.js";
import {myApp} from "../../../../app.js";

export class Collider {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    promptCollisionDetails(object = {}, collisionPoint = {}) {
        if (myApp.debug.logCollisionErrors) console.warn(this.constructor.name + "at position ", {
            col: this.x / 16,
            row: this.y / 16
        }, " has collided at point: ", collisionPoint);
        if (myApp.debug.drawCollisionErrors) GameObjectManager.drawGizmo(this.x + 8, this.y + 8, 'red');
    }
}