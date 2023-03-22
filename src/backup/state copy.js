class AppState {
    constructor(app){
        this.app = app;
        this.loopEvent = (deltaTime) => { this.loop(deltaTime) }
    }

    start() {
        this.app.ticker.add(this.loopEvent);
    }

    loop(deltaTime) {
        
    }

    change(newState) {
        this.app.ticker.remove(this.loopEvent);
        this.app.setState(newState);
        delete this
    }
}

class Demo extends AppState {
    constructor(app) {
        super(app);
    }

    start() {
        /*
        this.atrNames = [
            "moveRB","moveRF","moveF","moveLF","moveLB","moveB"
        ];
        */

        this.stateName = 'move';
        this.atrName = 'moveRB';
        this.app.stage.removeChildren();
        //this.chara = new ExSprite(this.app, 'Reimu', this.atrNames[0]);
        this.chara = new ExSprite(this.app, 'Reimu', this.atrName);
        this.app.stage.addChild(this.chara);
        this.chara.pos = new Vector2(this.app.screen.width / 2, this.app.screen.height / 2);
        
        this.chara.updatePos();
        this.chara.scale.set(3);

        this.time = 0;

        this.app.ticker.add(this.loopEvent);
    }

    loop(deltaTime) {
        this.time += deltaTime;

        //let vector = new Vector2(Math.cos(this.time / 30), Math.sin(this.time / 30));
        let center = new Vector2(this.app.screen.width / 2, this.app.screen.height / 2);
        let vector = this.app.pointerPos.sub(center);
        let [newStateName, newAtrName] = CharaAtr.judge('Reimu', this.stateName, this.atrName, vector);

        if(this.stateName != newStateName){
            this.stateName = newStateName;
        }
        if(this.atrName != newAtrName){
            this.atrName = newAtrName;
            this.chara.changeTextures('Reimu', this.atrName);
        }

        this.chara.updatePos();
    }
}