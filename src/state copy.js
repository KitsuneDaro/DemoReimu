class AppState {
    constructor(app){
        this.app = app;
        this.loopEvent = undefined;
    }

    startEvent() {
        this.loopEvent = this.app.addTickEvent((deltaTime) => { this.loop(deltaTime) }, this);
    }

    loop(deltaTime) {
        //deltaTime 60f/s
    }

    change(newState) {
        this.removeTickEvent(this.loopEvent);
        this.app.setState(newState);
        delete this;
    }
}

class Demo extends AppState {
    constructor(app) {
        super(app);
    }

    start() {
        this.app.stage.removeChildren();

        this.stateName = 'move';
        this.atrName = 'moveRB';

        this.chara = new ExSprite(this.app, 'Reimu', this.atrName);
        this.app.stage.addChild(this.chara);
        this.chara.pos = new Vector2(this.app.screen.width / 2, this.app.screen.height / 2);
        
        this.chara.updatePos(0);
        this.chara.scale.set(1);

        this.time = 0;

        this.startEvent();
    }

    loop(deltaTime) {
        this.time += deltaTime;

        let way = this.app.pointerPos.sub(this.chara.pos);
        way = way.setY(way.y * 2).normal();
        let acc = way.times(256);
        this.chara.vel = this.chara.vel.add(acc.times(deltaTime));
        this.chara.pos = this.chara.pos.add(this.chara.vel.setY(this.chara.vel.y / 2).times(deltaTime));

        if(this.chara.vel.getMagn() > 96){
            this.chara.vel = this.chara.vel.normal().times(96);
        }

        let [newStateName, newAtrName] = CharaAtr.judge('Reimu', this.stateName, this.atrName, this.chara.vel);

        if(this.stateName != newStateName){
            this.stateName = newStateName;
        }
        if(this.atrName != newAtrName){
            this.atrName = newAtrName;
            this.chara.changeTextures('Reimu', this.atrName);
        }

        this.chara.updatePos(deltaTime);
    }
}