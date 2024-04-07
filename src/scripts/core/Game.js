import {GameLoop} from "./GameLoop.js";
import {GameObjectManager} from "../entities/GameObjectManager.js";
//import {Tile} from "./src/entities/Tile.js";
import {Scene} from "../scenes/Scene.js";
import {TileSet} from "../scenes/Tilemaps/TileSet.js";
import {myApp} from "../../../app.js";
import {Ball} from "../entities/Ball.js";
import {AABB} from "../utils/collider/AABB.js";
import {CircleCollider} from "../utils/collider/CircleCollider.js";

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

    async Populate() {
        let scene = new Scene(myApp);

        // Initialize game entities

        // Initialize Ball
        this.ball = new Ball();
        this.ball.transform.position.x = 16 * 5;
        this.ball.transform.position.y = 16 * 7;
        this.ball.solid = true;
        this.ball.collider = new CircleCollider(this.ball.transform.x, this.ball.transform.y, 8)
        this.ball.Init();
        this.gameObjectManager.addGameObject(this.ball);

        // Initialize tiles
        await scene.loadScene().then(() => {
            this.gameObjectManager.addGameObjects(scene.tileMap);
        });


        //const enemies = createEnemies();

        // Setup input handlers
        //setupInputHandling();

        // Initialize other necessary game components
        // ...
    }

    async startGame() {
        await this.Populate().then(() => {
            // Instantiate and start the game loop
            this.gameLoop.GameLoop();
        })
    }
}

export {Game}