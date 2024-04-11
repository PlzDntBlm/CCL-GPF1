import {GameLoop} from "./GameLoop.js";
import {GameObjectManager} from "../entities/GameObjectManager.js";
//import {Tile} from "./src/entities/Tile.js";
import {Scene} from "../scenes/Scene.js";
import {TileSet} from "../scenes/Tilemaps/TileSet.js";
import {myApp, Restart} from "../../../app.js";
import {Ball} from "../entities/Ball.js";
import {AABB} from "../utils/collider/AABB.js";
import {CircleCollider} from "../utils/collider/CircleCollider.js";
import {Paddle} from "../entities/Paddle.js";

class Game {
    constructor() {
        console.log("Constructing Game");
        this.gameLoop = new GameLoop();
        this.tileSet = {};
        this.Keys = {
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        }
        this.lifes = 3;
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

        // Initialize Paddle
        this.paddle = new Paddle();
        this.paddle.Init();
        this.gameObjectManager.addGameObject(this.paddle);

        // Initialize Ball
        this.ball = new Ball();
        this.ball.transform.position.x = 16.0 * 5;
        this.ball.transform.position.y = 16.0 * 7;
        this.ball.transform.sizeInPixel.x = 8;
        this.ball.transform.sizeInPixel.y = 8;
        this.ball.solid = true;
        this.ball.collider = new CircleCollider(this.ball.transform.x, this.ball.transform.y, this.ball.transform.sizeInPixel.x / 2)
        this.ball.Init();
        this.gameObjectManager.addGameObject(this.ball);

        // Initialize tiles
        await scene.loadScene(2).then(() => {
            this.gameObjectManager.addGameObjects(scene.tileMap);
        });


        //const enemies = createEnemies();

        // Setup input handlers
        this.SetupInputHandling();

        // Initialize other necessary game components
        // ...
    }

    lifeMinus() {
        if (this.lifes > 0) this.lifes--; else Restart();
    }

    async startGame() {
        await this.Populate().then(() => {
            // Instantiate and start the game loop
            this.gameLoop.GameLoop();
        })
    }

    SetupInputHandling() {
        document.addEventListener('keydown', (e) => {
            // Check if the key is one of the ones we're interested in
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                this.Keys.ArrowLeft = true;
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                this.Keys.ArrowRight = true;
            } else if (e.key === ' ') {
                this.Keys.Space = true;
            }
            // Prevent default to avoid any unwanted side effects (e.g., scrolling)
            e.preventDefault();
        });

        document.addEventListener('keyup', (e) => {
            // Check if the key is one of the ones we're interested in
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                this.Keys.ArrowLeft = false;
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                this.Keys.ArrowRight = false;
            } else if (e.key === ' ') {
                this.Keys.Space = false;
            }
            // Prevent default to avoid any unwanted side effects
            e.preventDefault();
        });
    }
}

export {Game}