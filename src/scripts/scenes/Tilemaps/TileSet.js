import {myApp} from "../../../../app.js";

export class TileSet {
    constructor() {
        console.log("Constructed TileSet");
    }

    async loadTilesetFromFile() {
        try {
            const response = await fetch(myApp.assetsPath + "images/Tileset/Px2D Tileset.tsx");
            const tsxFileContent = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(tsxFileContent, "text/xml");
            const tileSetJson = this.xmlToJson(xmlDoc);

            TileSet.SpriteSheet = new Image();
            TileSet.SpriteSheet.onload = () => {
                //console.log(TileSet.SpriteSheet instanceof HTMLImageElement); // True
                //console.log(TileSet.SpriteSheet.complete); // True
                console.log("Loaded SpriteSheet");

                // Here, you can now safely use Tileset.SpriteSheet for rendering, etc.
            };
            TileSet.SpriteSheet.onerror = (error) => {
                console.error('Error loading the sprite sheet image:', error);
            };
            TileSet.SpriteSheet.src = myApp.assetsPath + "images/Pyxel SpriteSheet_alt.png";

            tileSetJson.tileset.tile.forEach((el) => {
                TileSet.TileSet.push({
                    tileNumber: Number(el['@attributes'].id),
                    type: el['@attributes'].type,
                    source: {
                        locationOnSpriteSheet: {
                            col: el['@attributes'].id % 16,
                            row: Math.floor(el['@attributes'].id / 16)
                        }
                    }
                });
            });
            console.log("Created TileSet");
        } catch (error) {
            console.error('Error fetching the .tsx file:', error);
        }
    }

    static TileSet = [];
    static SpriteSheet = null;

    xmlToJson(xml) {
        let obj = {};

        if (xml.nodeType === 1) { // element
            // attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    let attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) { // text
            obj = xml.nodeValue;
        }

        // children
        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                let item = xml.childNodes.item(i);
                let nodeName = item.nodeName;
                if (typeof (obj[nodeName]) === "undefined") {
                    obj[nodeName] = this.xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) === "undefined") {
                        let old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.xmlToJson(item));
                }
            }
        }
        return obj;
    }
}
