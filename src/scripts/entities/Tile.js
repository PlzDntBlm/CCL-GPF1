import {GameObject} from "./GameObject.js";
import {TileSet} from "../scenes/Tilemaps/TileSet.js";
import {myApp} from "../../../app.js";
import {GameLoop} from "../core/GameLoop.js";
import {AABB} from "../utils/collider/AABB.js";
import {Ball} from "./Ball.js";

export class Tile extends GameObject {
    constructor(data = {}) {
        super();
        // Initialize data.tile if it's not provided
        data.tile = data.tile || {};
        data.tile.type = data.tile.type || 0;

        // Initialize data.tile.position if it's not provided
        data.tile.position = data.tile.position || {};
        data.tile.position.row = data.tile.position.row || 0;
        data.tile.position.col = data.tile.position.col || 0;
        data.solid = data.solid || false;
        data.destructible = data.destructible || false;

        this.tile = data.tile
        this.collider = this.tile.solid ? new AABB(data.tile.position.x, data.tile.position.y, 16, 16) : null;
        this.toBeDestroyed = false;

        this.renderer.drawMode = 'texture';
        this.transform.sizeInPixel.x = 16;
        this.transform.sizeInPixel.y = 16;
    }

    static tileCoordinatesToPixelPosition(data = {}) {
        data = {
            col: data.col || 0,
            row: data.row || 0
        }

        let x = 0;
        let y = 0;
        if (typeof data.col === 'number' && typeof data.row === 'number') {
            x = 16 * data.col;
            y = 16 * data.row;
            return {x: x, y: y};
        } else {
            console.log(`Can't convert col:${data.col} and row:${data.row} into PixelCoordinates!`);
            return {x: x, y: y};
        }
    }

    addCollider() {
        this.transform.position = Tile.tileCoordinatesToPixelPosition({
            col: this.tile.position.col,
            row: this.tile.position.row
        });
        this.collider = new AABB(this.transform.position.x, this.transform.position.y, 16, 16);
    }

    OnCollision(other) {
        if (other instanceof Ball && this.tile.destructible) {
            this.toBeDestroyed = true; // Flag the tile for removal
        }
    }


    Render() {
        //console.log(this);
        // Draw on column
        let tmpPosition = {col: this.tile.position.col, row: this.tile.position.row};//check
        //console.log(tmpPosition);//check
        let tmpCoordinates = Tile.tileCoordinatesToPixelPosition(tmpPosition);//check
        //tmpCoordinates.y;//check
        //console.log(tmpCoordinates);//check
        let tmpSize = this.transform.sizeInPixel;//check
        //console.log(this.transform.sizeInPixel);//check
        let tmpType = this.tile.type;
        let tmpSource = {
            row: Math.floor(tmpType / 16) || 0,
            col: tmpType % 16 || 0
        };
        if (tmpType >= 0) {
            // Corrected drawImage call
            // Safe to draw the image
            try {
                myApp.context.drawImage(
                    TileSet.SpriteSheet,
                    tmpSource.col * 16, // Source X: Column index multiplied by the width of one tile
                    tmpSource.row * 16, // Source Y: Row index multiplied by the height of one tile
                    16, // Source Width: The width of one tile
                    16, // Source Height: The height of one tile
                    tmpCoordinates.x, // Destination X
                    tmpCoordinates.y, // Destination Y
                    tmpSize.x, // Destination Width
                    tmpSize.y // Destination Height
                );
                //console.log(GameLoop.FrameCounter)
                //console.log(Tileset.SpriteSheet)
                //console.log("----------------------------");
            } catch (e) {
                console.log(GameLoop.FrameCounter)
                console.log(e);
                console.log(TileSet.SpriteSheet)
                console.log("----------------------------");
            }
        }
    }
}