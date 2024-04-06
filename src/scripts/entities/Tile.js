import {GameObject} from "./GameObject.js";
import {TileSet} from "../scenes/Tilemaps/TileSet.js";
import {myApp} from "../../../app.js";
import {GameLoop} from "../core/GameLoop.js";

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

        this.tile = data.tile;
        //this.setTileType(data.tile.type);

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