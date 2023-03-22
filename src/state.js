class AppState {
    constructor(app) {
        this.app = app;
        this.loopEvent = undefined;
    }

    start() {
        this.startEvent();
    }

    startEvent() {
        this.loopEvent = this.app.addTickEvent((deltaTime) => { this.loop(deltaTime) }, this);
    }

    loop(deltaTime) {
        //deltaTime 60f/s
    }

    change(newState) {
        this.app.removeTickEvent(this.loopEvent);
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

        this.background = new ExSprite(this.app, 'BackGrounds', 'Shrine');
        this.background.x = 100;
        this.background.y = 80;
        this.app.stage.addChild(this.background);

        this.chara = new Reimu(this.app, 'move');
        this.chara.pos = new Vector3(this.app.screen.width / 2, this.app.screen.height / 2, 0);
        this.chara.updatePos(0);

        this.rightUI = new RightUI(this.app);

        this.time = 0;

        this.startEvent();
    }

    loop(deltaTime) {
        this.time += deltaTime;

        this.chara.loopAll(deltaTime);

        if (KeyBoard.key['Enter']) {
            this.change(new Stop(this.app));
        }
    }
}

class RightUI {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        let backColor = new PIXI.Graphics().beginFill('0x000000').drawRect(0, 0, 80, 160).endFill();
        this.container.addChild(backColor);
        this.container.x = 200;

        this.app.stage.addChild(this.container);
    }
}

class Stop extends AppState {

}