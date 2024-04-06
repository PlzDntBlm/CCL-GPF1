import {GameObject} from "./GameObject.js";
import {myApp} from "../../../app.js";

export class Player extends GameObject {
    constructor() {
        super();
        this.renderer.imageSrc = '/images/Player.png';
        this.renderer.drawMode = 'texture';
        this.transform.sizeInPixel.x = 16;
        this.transform.sizeInPixel.y = 16;
        this.renderer.redraw = true;
        this.renderer.image = new Image();
        this.renderer.image.src = myApp.assetsPath + this.renderer.imageSrc;
        console.log("Loaded Player Image");
        console.log("Constructed Player");
    }

    Render() {
        myApp.context.drawImage(this.renderer.image, this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
    }
}