import {myApp} from "../../../app.js";

export class GameObject {
    constructor(data = {}) {
        // Set default values if data or its properties are undefined
        data.transform = data.transform || {};
        data.transform.position = data.transform.position || {};
        data.transform.scale = data.transform.scale || {};
        data.transform.sizeInPixel = data.transform.sizeInPixel || {};
        data.renderer = data.renderer || {};

        this.transform = {
            position: {
                x: data.transform.position.x || 0.0,
                y: data.transform.position.y || 0.0
            },
            scale: {
                x: data.transform.scale.x || 1,
                y: data.transform.scale.y || 1
            },
            sizeInPixel: {
                x: data.transform.sizeInPixel.x || 16,
                y: data.transform.sizeInPixel.y || 16
            }
        };
        this.renderer = {
            imageSrc: data.renderer.imageSrc || null,
            drawMode: data.renderer.drawMode || 'rect',
            redraw: data.renderer.redraw || false,
            fillColor: data.renderer.fillColor || 'black',
        };
        this.currentCollisions = [];
    }

    Update(deltaTime) {

    }

    FixedUpdate(fixedDeltaTime) {

    }

    Render() {
        if (this.renderer.drawMode === 'rect') {
            myApp.context.beginPath();
            myApp.context.fillStyle = this.renderer.fillColor;
            myApp.context.fillRect(this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
            myApp.context.stroke();
        }
        if (this.renderer.drawMode === 'texture') {
            const img = new Image();
            img.src = myApp.assetsPath + this.renderer.imageSrc;
            myApp.context.drawImage(img, this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x, this.transform.sizeInPixel.y);
        }
        if (this.renderer.drawMode === 'circle') {
            myApp.context.beginPath();
            myApp.context.arc(this.transform.position.x, this.transform.position.y, this.transform.sizeInPixel.x / 2, 0, Math.PI * 2);
            myApp.context.strokeStyle = this.renderer.fillColor;
            myApp.context.stroke();
        }
    }

    OnCollision(other, collisionPoint) {
        this.currentCollisions.push({other: other, collisionPoint: collisionPoint});
    }
}