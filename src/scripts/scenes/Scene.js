import {Tile} from "../entities/Tile.js";
import {Hub} from "../../assets/scenes/Hub.js";
import {myApp} from "../../../app.js";
import {GameObjectManager} from "../entities/GameObjectManager.js";
import {Game} from "../core/Game.js";
import {AABB} from "../utils/collider/AABB.js";

export class Scene {
    constructor() {
        this.tileMap = new Array(0);
    }

    static SetTileInTileMap(tileMap, tileType, col, row) {
        try {
            // tileMap + tile
            if (arguments.length === 2) {
                // row * 16 + col
                tileMap[tileType.tile.position.row * 16 + tileType.tile.position.col] = tileType;
            }
            // tileMap, tileType, col, row
            if (arguments.length === 4) {
                let tile = new Tile();

                tile.tile.type = tileType + 1;
                tile.tile.position.col = col;
                tile.tile.position.row = row;

                if (tile.tile.type > 0) {
                    tile.addCollider();
                }


                tileMap[row * 16 + col] = tile;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async loadScene() {
        await fetch(myApp.assetsPath + "scenes/Level_1.csv")
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n'); // Split CSV text into rows
                let tiles = [];
                rows.forEach(row => {
                    tiles.push(...row.split(',').map(Number)); // Split each row by comma and convert to number
                });

                let colCounter = 0;
                let rowCounter = 0;
                tiles.forEach((tile) => { // Now using the tiles array
                    tile = --tile; // Adjust tile index if necessary
                    Scene.SetTileInTileMap(this.tileMap, tile, colCounter, rowCounter);
                    colCounter++;
                    if (colCounter % 16 === 0) { // Assuming a width of 16 tiles
                        rowCounter++;
                        colCounter = 0;
                    }
                });
            })
            .catch(error => console.error('Error loading or parsing CSV:', error));
    }

    // loadScene() {
    //     let colCounter = 0;
    //     let rowCounter = 0;
    //     Hub.layers[0].data.forEach((tile) => { // Using arrow function
    //         tile = --tile;
    //         Scene.SetTileInTileMap(this.tileMap, tile, colCounter, rowCounter);
    //         colCounter++;
    //         if (colCounter % 16 === 0) {
    //             rowCounter++;
    //             colCounter = 0;
    //         }
    //     });
    //     //console.log(Hub.layers[0].data);
    // }
}