import {myApp} from "../../../app.js";
import {CircleCollider} from "../utils/collider/CircleCollider.js";
import {AABB} from "../utils/collider/AABB.js";
import {GameObject} from "./GameObject.js";

export class GameObjectManager {
    constructor() {
        this.gameObjects = [];
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

                // Insert logging to verify the collision check is running
                //console.log('Checking collision between', objA, 'and', objB);

                if (objA.collider instanceof CircleCollider && objB.collider instanceof AABB) {
                    if (objA.collider.intersectsAABB(objB.collider)) {
                        // console.log('Collision detected between', objA, 'and', objB);
                        objA.OnCollision(objB);
                        // this.drawHitMarker(objB.transform.position.x, objB.transform.position.y)
                    }
                } else if (objA.collider instanceof AABB && objB.collider instanceof CircleCollider) {
                    if (objB.collider.intersectsAABB(objA.collider)) {
                        // console.log('Collision detected between', objA, 'and', objB);
                        objB.OnCollision(objA);
                        // this.drawHitMarker(objB.transform.position.x, objB.transform.position.y)
                    }
                }
            }
        }
    }

    drawHitMarker(x, y) {
        let gizmo = new GameObject(
            {
                transform: {
                    position: {
                        x: x,
                        y: y
                    },
                    sizeInPixel: 2
                },
                renderer: {
                    drawMode: "circle",
                    fillColor: "green"
                }
            }
        );
        this.addGameObject(gizmo);
    }

    RenderGameObjects() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.Render();
            if (myApp.debug.drawCollider && gameObject.collider && typeof gameObject.collider === 'object') gameObject.collider.draw();
        });
    }
}