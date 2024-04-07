import {myApp} from "../../../app.js";
import {CircleCollider} from "../utils/collider/CircleCollider.js";
import {AABB} from "../utils/collider/AABB.js";
import {GameObject} from "./GameObject.js";

export class GameObjectManager {
    static Instance= null;
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
        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = i + 1; j < this.gameObjects.length; j++) {
                let objA = this.gameObjects[i];
                let objB = this.gameObjects[j];

                if (objA.collider instanceof CircleCollider && objB.collider instanceof AABB) {
                    // If objA is a Circle and objB is an AABB
                    const result = objB.collider.intersectsCircle(objA.collider);
                    if (result.intersects) {
                        // Collision detected
                        GameObjectManager.drawGizmo(result.collisionPoint.x, result.collisionPoint.y);
                        console.log('Collision detected between', objA.constructor.name, 'and', objB.constructor.name, result.collisionPoint);
                    }
                } else if (objA.collider instanceof AABB && objB.collider instanceof CircleCollider) {
                    // If objA is an AABB and objB is a Circle
                    const result = objA.collider.intersectsCircle(objB.collider);
                    if (result.intersects) {
                        // Collision detected
                        GameObjectManager.drawGizmo(result.collisionPoint.x, result.collisionPoint.y);
                        console.log('Collision detected between', objA.constructor.name, 'and', objB.constructor.name, result.collisionPoint);
                    }
                } else if (objA.collider instanceof AABB && objB.collider instanceof AABB) {
                    // If both objA and objB are AABBs
                    const result = objA.collider.intersects(objB.collider);
                    if (result.intersects) {
                        // Collision detected
                        GameObjectManager.drawGizmo(result.collisionPoint.x, result.collisionPoint.y);
                        console.log('Collision detected between', objA.constructor.name, 'and', objB.constructor.name, result.collisionPoint);
                    }
                }
            }
        }
    }


    static drawGizmo(x, y, color = 'greenyellow') {
        if (myApp.debug.drawGizmo){
            let gizmo = new GameObject(
                {
                    transform: {
                        position: {
                            x: x,
                            y: y
                        },
                        sizeInPixel: {
                            x:3
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