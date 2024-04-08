import {myApp} from "../../../app.js";
import {CircleCollider} from "../utils/collider/CircleCollider.js";
import {AABB} from "../utils/collider/AABB.js";
import {GameObject} from "./GameObject.js";

export class GameObjectManager {
    static Instance = null;

    constructor() {
        this.gameObjects = [];
        GameObjectManager.Instance = this;
        console.log("Constructed GameObjectManager");
    }

    getGameObjects() {
        return this.gameObjects;
    }

    setGameObjects(gameObjects) {
        this.gameObjects = gameObjects;
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    addGameObjects(data = []) {
        data.forEach((gameObject) => {
            this.gameObjects.push(gameObject);
        });
    }


    UpdateGameObjects(deltaTime) {
        this.gameObjects.forEach((gameObject) => {
            gameObject.Update(deltaTime);
        });
    }

    FixedUpdateGameObjects(fixedDeltaTime) {
        this.gameObjects.forEach((gameObject) => {
            gameObject.FixedUpdate(fixedDeltaTime);
        });
    }

    handleCollisions() {
        let processedCollisions = new Set();

        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = i + 1; j < this.gameObjects.length; j++) {
                let objA = this.gameObjects[i];
                let objB = this.gameObjects[j];

                // Create a unique identifier for the collision pair
                let collisionId = `${Math.min(objA.id, objB.id)}-${Math.max(objA.id, objB.id)}`;

                // Skip this pair if the collision has already been processed
                if (processedCollisions.has(collisionId)) {
                    continue;
                }

                // Check for collisions and process them
                let result = null;

                if (objA.collider instanceof CircleCollider && objB.collider instanceof AABB) {
                    result = objA.collider.intersectsAABB(objB.collider);
                } else if (objA.collider instanceof AABB && objB.collider instanceof CircleCollider) {
                    result = objB.collider.intersectsAABB(objA.collider);
                } else if (objA.collider instanceof AABB && objB.collider instanceof AABB) {
                    result = objA.collider.intersects(objB.collider);
                }

                // If a collision is detected, handle it
                if (result && result.intersects) {
                    // Log collision if debugging is enabled
                    if (myApp.debug.logCollisions) console.log('Collision detected between', objA.constructor.name, 'and', objB.constructor.name, result.collisionPoint);
                    if (myApp.debug.drawCollisionPoints) GameObjectManager.drawGizmo(result.collisionPoint.x, result.collisionPoint.y);
                    if (myApp.debug.logCollisionPoints) console.log(result.collisionPoint);


                    // Call collision handlers for both objects
                    objA.OnCollision(objB, result.collisionPoint);
                    //console.log(objB)
                    objB.OnCollision(objA, result.collisionPoint);

                    // Add this pair to the set of processed collisions
                    processedCollisions.add(collisionId);
                }
            }
        }

        // Clear the processedCollisions set for the next update cycle
        processedCollisions.clear();
    }


    static drawGizmo(x, y, color = 'greenyellow') {
        if (myApp.debug.drawGizmo) {
            let gizmo = new GameObject(
                {
                    transform: {
                        position: {
                            x: x,
                            y: y
                        },
                        sizeInPixel: {
                            x: 3
                        }
                    },
                    renderer: {
                        drawMode: "circle",
                        fillColor: color
                    }
                }
            );
            GameObjectManager.Instance.addGameObject(gizmo);
        }
    }

    RenderGameObjects() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.Render();
            if (myApp.debug.drawCollider && gameObject.collider && typeof gameObject.collider === 'object') gameObject.collider.draw();
        });
    }
    HandleInput(){
        this.gameObjects.forEach((gameObject) => {
            gameObject.HandleInput();
        });
    }
}