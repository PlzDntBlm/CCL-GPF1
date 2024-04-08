import {startResizing} from "./src/styles/ResizeCanvas.js";
import {Game} from "./src/scripts/core/Game.js";

window.onload = async () => {
    init();
};
export let myApp;

async function init() {
    myApp = new App();
    await myApp.Start();
}

class App {
    constructor() {
        this.game = null;
        this.context = null;
        this.canvas = {
            width: 256,
            height: 240
        }
        this.assetsPath = "./src/assets/";
        this.debug = {
            log: true,
            logFrameNumber:true,
            drawCollider: false,
            drawGizmo: true,
            logCollisions: false,
            logCollisionPoints: false,
            drawCollisionPoints: true,
            logCollisionErrors: true,
            drawCollisionErrors: true,
        };
    }

    async Start() {
        // Call the function to add the overlay to the document
        this.setup().then(async () => {
            this.game = new Game(this);
            await this.game.Init();
        });
    }

    async setup() {
        await this.addOverlay();
    }

    async addOverlay() {
        // Create overlay element
        this.overlay = document.createElement("div");
        this.overlay.id = "pxBricks-overlay";

        // Create canvas element
        let canvas = document.createElement("canvas");
        canvas.id = "pxBricks-canvas";
        canvas.width = this.canvas.width; // Set canvas width as needed
        canvas.height = this.canvas.height; // Set canvas height as needed
        // Append canvas to the overlay
        this.overlay.appendChild(canvas);


        // Append overlay to the body
        //document.body.appendChild(this.overlay);
        const canvasDiv = document.querySelector("#canvas");
        canvasDiv.append(this.overlay);
        this.context = document.querySelector("#pxBricks-canvas").getContext("2d");

        this.context.imageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false; // For Firefox
        this.context.webkitImageSmoothingEnabled = false; // For Safari
        this.context.msImageSmoothingEnabled = false; // For IE

        startResizing();
    }
}
