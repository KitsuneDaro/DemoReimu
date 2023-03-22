PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

// imgAtrNames = {'img0': ['Atr0',...],...}
class ExApp extends PIXI.Application {
    static get TEXTURE_PATH(){ return './textures' };

    constructor(elm, imgAtrNames, dic) {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        super(dic);

        this.imgAtrNames = imgAtrNames;
        this.imgNames = Object.keys(imgAtrNames);
        this.stage.interactive = true;

        this.setImg();

        this.textureArray = {};
        this.loader.load(() => {
            $.ajaxSetup({ async: false });
            this.setTexture();
            $.ajaxSetup({ async: true });
        });

        this.state = undefined;
        
        this.pointerPos = new Vector2(0, 0);
        this.setPointer();

        elm.append(this.view);
    }

    setState(state) {
        this.state = state;
        this.state.start();
    }

    setImg() {
        this.imgNames.forEach(imgName => {
            this.imgAtrNames[imgName].forEach(atrName => {
                this.loader.add(ExApp.getLoadId(imgName, atrName), ExApp.getJsonPath(imgName, atrName));
            });
        });
    }

    setTexture() {
        this.imgNames.forEach(imgName => {
            this.textureArray[imgName] = {};

            this.imgAtrNames[imgName].forEach(atrName => {
                let loadId = ExApp.getLoadId(imgName, atrName);
                let texturesById = this.loader.resources[loadId].textures;
                
                let textures = Object.keys(texturesById).map(id => {
                    return texturesById[id];
                });
                let durations = Array(textures.length);

                $.getJSON(ExApp.getJsonPath(imgName, atrName), ((jsonData) => {
                    try {
                        for (let frame = 0; frame < textures.length; ++frame) {
                            durations[frame] = jsonData.frames[imgName + ' ' + String(frame) +'.aseprite'].duration;
                        }
                    } catch {
                        durations.fill(100);
                    }
                }).bind(this));

                this.textureArray[imgName][atrName] = Array(textures.length);
                
                for (let frame = 0; frame < textures.length; ++frame) {
                    this.textureArray[imgName][atrName][frame] = {
                        'texture': textures[frame],
                        'time': durations[frame]
                    };
                }
            });
        });
    }

    setText() {
        this.loader.add('MaruMonica', './font/MaruMonica.ttf');
    }

    setPointer() {
        let func = ((e) => {
            let pos = ExApp.getPointerPos(e);
            if(pos.inRect(this.screen)){
                this.pointerPos = pos;
            }
        }).bind(this);
        let eventNames = ['pointermove', 'pointerdown', 'pointerup', 'pointerout'];

        eventNames.forEach((eventName) => {
            this.stage.on(eventName, func);
        });
    }

    addTickEvent(event) {
        let fixedEvent = (deltaTime) => {
            deltaTime /= 60;
            
            event(deltaTime);
        };
        
        this.ticker.add(fixedEvent);

        return fixedEvent;
    }

    removeTickEvent(event) {
        this.ticker.remove(event);
    }

    static getPointerPos(e){
        let pos = e.data.getLocalPosition(e.currentTarget);
        return new Vector2(pos.x, pos.y);
    }

    static getLoadId(imgName, atrName) {
        return imgName + '_' + atrName;
    }

    static getJsonPath(imgName, atrName) {
        return ExApp.TEXTURE_PATH + '/' + imgName + '/' + atrName + '.json';
    }
}

class ExSprite extends PIXI.AnimatedSprite {
    constructor(app, imgName, atrName) {
        super(app.textureArray[imgName][atrName]);
        this.app = app;

        this.anchor.set(0.5);
        this.play();
    }

    changeTextures(imgName, atrName) {
        let currentFrame = this.currentFrame;
        this.textures = this.app.textureArray[imgName][atrName];
        
        this.anchor.set(0.5);
        this.gotoAndPlay(currentFrame);
    }

    updatePos(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
}