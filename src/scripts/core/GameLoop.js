import {myApp} from "../../../app.js";
import {Game} from "./Game.js";

export class GameLoop {
    static FrameCounter = 0;

    constructor() {
        this.lastRenderTime = 0;
        this.accumulatedTime = 0;
        this.fixedTimeStep = 1000 / 60; // 60 updates per second
        console.log("Constructed GameLoop")
    }

    GameLoop(timestamp = 0) {
        let deltaTime = timestamp - this.lastRenderTime;
        this.lastRenderTime = timestamp;
        this.accumulatedTime += deltaTime;

        while (this.accumulatedTime >= this.fixedTimeStep) {
            //this.FixedUpdate(this.fixedTimeStep);
            this.accumulatedTime -= this.fixedTimeStep;
        }
        this.HandleInput();
        this.Update(deltaTime); // Updates positions of all game objects
        this.HandleCollisions(); // Checks and handles collisions
        this.Render(); // Renders the game objects to the canvas

        requestAnimationFrame((timestamp) => this.GameLoop(timestamp)); // Sets up the next call to gameLoop
    }

    Update(deltaTime) {
        // Update game entities and logic based on variable deltaTime
        if (Game) {
            Game.Instance.gameObjectManager.UpdateGameObjects(deltaTime);
        }
    }

    FixedUpdate(fixedDeltaTime) {
        // Consistent update logic, independent of frame rate
        Game.Instance.gameObjectManager.FixedUpdateGameObjects(fixedDeltaTime);
    }

    Render() {
        GameLoop.FrameCounter++;
        // Clear canvas and draw game entities
        myApp.context.clearRect(0, 0, myApp.overlay.firstChild.width, myApp.overlay.firstChild.height);
        Game.Instance.gameObjectManager.RenderGameObjects(myApp);
    }

    HandleCollisions() {
        Game.Instance.gameObjectManager.handleCollisions();
    }

    HandleInput() {
        Game.Instance.paddle.HandleInput();
    }
}
