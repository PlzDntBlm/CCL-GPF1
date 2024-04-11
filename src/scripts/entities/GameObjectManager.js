import {myApp} from "../../../app.js";
import {CircleCollider} from "../utils/collider/CircleCollider.js";
import {AABB} from "../utils/collider/AABB.js";
import {GameObject} from "./GameObject.js";
import {Tile} from "./Tile.js";
import {Ball} from "./Ball.js";
import {Paddle} from "./Paddle.js";

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
        // Filter out dynamic objects (Ball, Paddle) and static objects (Tile)
        let dynamicObjects = this.gameObjects.filter(obj => obj instanceof Ball || obj instanceof Paddle);
        let staticObjects = this.gameObjects.filter(obj => obj instanceof Tile);

        dynamicObjects.forEach(dynamicObj => {
            dynamicObj.currentCollisions = [];
            staticObjects.forEach(staticObj => {
                // Perform collision checks only if both objects have colliders
                if (dynamicObj.collider && staticObj.collider) {
                    let result = this.checkCollision(dynamicObj, staticObj);
                    // Process collision result
                    if (result && result.intersects) {
                        this.processCollision(dynamicObj, staticObj, result);
                    }
                }
            });

            // Perform dynamic-to-dynamic collision checks (e.g., Ball to Paddle)
            dynamicObjects.forEach(otherDynamicObj => {
                if (dynamicObj !== otherDynamicObj && dynamicObj.collider && otherDynamicObj.collider) {
                    let result = this.checkCollision(dynamicObj, otherDynamicObj);
                    // Process collision result
                    if (result && result.intersects) {
                        this.processCollision(dynamicObj, otherDynamicObj, result);
                    }
                }
            });
        });
    }

// Helper function for checking collision between two objects
    checkCollision(objA, objB) {
        if (objA.collider instanceof CircleCollider && objB.collider instanceof AABB) {
            return objA.collider.intersectsAABB(objB.collider);
        } else if (objA.collider instanceof AABB && objB.collider instanceof CircleCollider) {
            return objB.collider.intersectsAABB(objA.collider);
        } else if (objA.collider instanceof AABB && objB.collider instanceof AABB) {
            return objA.collider.intersects(objB.collider);
        }
        return null; // No collision detected or invalid collider types
    }

// Helper function for logging collision and calling the OnCollision methods
    processCollision(objA, objB, result) {
        if (myApp.debug.logCollisions) {
            console.log('Collision detected between', objA.constructor.name, 'and', objB.constructor.name, result.collisionPoint);
        }
        if (myApp.debug.drawCollisionPoints) {
            GameObjectManager.drawGizmo(result.collisionPoint.x, result.collisionPoint.y);
        }
        if (myApp.debug.logCollisionPoints) {
            console.log(result.collisionPoint);
        }

        // Call collision handlers for both objects
        objA.OnCollision(objB, result.collisionPoint);
        objB.OnCollision(objA, result.collisionPoint);
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
}