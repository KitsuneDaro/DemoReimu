class Reimu extends Chara {
    constructor(app, stateName){
        super(app, stateName);
        this.sprite.scale.set(1);
    }

    loop(deltaTime) {

    }

    move(deltaTime) {
        let point = Movement.pointerToPoint(this.app.pointerPos);
        let way = point.sub(this.pos);
        way = way.normal();

        this.acc = way.times(CharaData.Reimu.Const.moveAccMagn);
        console.log(this.app.pointerPos);

        if(this.vel.getMagn() > CharaData.Reimu.Const.moveMaxVelMagn){
            this.vel = this.vel.normal().times(CharaData.Reimu.Const.moveMaxVelMagn);
        }
        this.vel.getRadXY();

        if(this.pos.x < 0) {
            this.pos.x = 0;
        }
        if(this.pos.y < 0) {
            this.pos.y = 0;
        }

        this.state.updateSuffix();
    }
}