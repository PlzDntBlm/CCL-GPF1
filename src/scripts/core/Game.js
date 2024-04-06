import {GameLoop} from "./GameLoop.js";
import {GameObjectManager} from "../entities/GameObjectManager.js";
import {Player} from "../entities/Player.js";
//import {Tile} from "./src/entities/Tile.js";
import {Scene} from "../scenes/Scene.js";
import {TileSet} from "../scenes/Tilemaps/TileSet.js";
import {myApp} from "../../../app.js";

class Game {
    constructor() {
        console.log("Constructing Game");
        this.gameLoop = new GameLoop();
        this.tileSet = {};
        Game.Instance = this;
    }

    static Instance = {}

    async Init() {
        this.gameObjectManager = await new GameObjectManager();
        await this.loadAssets().then(() => {
            console.log("Assets Loaded");
            this.startGame();
        });
    }

    async loadAssets() {
        console.log("Loading Assets")
        // Load assets
        this.tileSet = new TileSet();
        await this.tileSet.loadTilesetFromFile();
    }

    async StartGameLoop() {
        let scene = new Scene(myApp);

        // Initialize game entities

        // Initialize player
        this.player = new Player();
        this.player.transform.position.x = 16 * 3.5;
        this.player.transform.position.y = 16 * 7;
        this.gameObjectManager.addGameObject(this.player);

        // Initialize tiles
        await scene.loadScene().then(() => {
            this.gameObjectManager.addGameObjects(scene.tileMap);
        });
        console.log(this.gameObjectManager.gameObjects)


        //const enemies = createEnemies();

        // Setup input handlers
        //setupInputHandling();

        // Initialize other necessary game components
        // ...

        // Instantiate and start the game loop
        this.gameLoop.GameLoop();
    }

    startGame() {
        this.StartGameLoop();
    }
}

export {Game}