import {startResizing} from "./src/styles/ResizeCanvas.js";

window.onload = () => {
    init();
};

function init() {
    let myApp = new App();
}

class App {
    constructor() {
        this.context = null;
        this.canvas = {
            width: 256,
            height: 240
        }
        this.assetsPath = "./src/assets/";

        this.addOverlay();
    }

    addOverlay() {
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
        startResizing();
    }
}
