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

    RenderGameObjects() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.Render();
        });
    }
}