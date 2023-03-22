class CharaData {
    static get JSON_PATH() { return './data/charaData.json' }

    static load() {
        $.getJSON(CharaData.JSON_PATH, (jsonData) => {
            let dataKinds = Object.keys(jsonData);

            dataKinds.forEach((dataKind) => {
                if (dataKind == 'stateSuffix') {
                    CharaData.loadStateSuffix(jsonData[dataKind]);
                } else if (dataKind == 'chara') {
                    CharaData.loadChara(jsonData[dataKind]);
                } else if (dataKind == 'const') {
                    CharaData.loadConst(jsonData[dataKind]);
                }
            })
        });
    }

    static loadStateSuffix(jsonData) {
        let suffixKinds = Object.keys(jsonData);
        CharaData.StateSuffix = {};
        CharaData.StateSuffix.Ranges = {};
        CharaData.StateSuffix.IdAndNames = {};

        suffixKinds.forEach((suffixKind) => {
            let suffixNames = Object.keys(jsonData[suffixKind].range);

            let suffixRange = [];
            let suffixIdAndName = new IdAndName();

            suffixNames.forEach((suffixName) => {
                suffixIdAndName.push(suffixName);
                suffixRange.push(CharaData.fixRange(jsonData[suffixKind].unit, jsonData[suffixKind].range[suffixName]));
            })

            CharaData.StateSuffix.Ranges[suffixKind] = suffixRange;
            CharaData.StateSuffix.IdAndNames[suffixKind] = suffixIdAndName;
        });
    }

    static loadChara(jsonData) {
        let charaNames = Object.keys(jsonData);

        charaNames.forEach((charaName) => {
            let dataKinds = Object.keys(jsonData[charaName]);
            CharaData[charaName] = {};

            dataKinds.forEach((dataKind) => {
                if (dataKind == 'state') {
                    CharaData.loadCharaState(jsonData[charaName][dataKind], charaName);
                } else if (dataKind == 'const') {
                    CharaData.loadCharaConst(jsonData[charaName][dataKind], charaName);
                }
            });
        });
    }

    static loadCharaState(jsonData, charaName) {
        let stateNames = Object.keys(jsonData);
        CharaData[charaName].State = {};

        stateNames.forEach((stateName) => {
            let dataKinds = Object.keys(jsonData[stateName]);
            CharaData[charaName].State[stateName] = {};

            dataKinds.forEach((dataKind) => {
                if (dataKind == 'useSuffix') {
                    CharaData[charaName].State[stateName][dataKind] = jsonData[stateName][dataKind];
                } else if (dataKind == 'transition') {
                    let transNames = Object.keys(jsonData[stateName][dataKind]);
                    CharaData[charaName].State[stateName][dataKind] = {};

                    transNames.forEach((transName) => {
                        let trans = jsonData[stateName][dataKind][transName];
                        trans.range = CharaData.fixRange(trans.unit, trans.range);
                        trans.unit = undefined;
                        CharaData[charaName].State[stateName][dataKind][transName] = trans;
                    });
                }
            });
        });
    }

    static loadCharaConst(jsonData, charaName) {
        let constNames = Object.keys(jsonData);
        CharaData[charaName].Const = {};

        constNames.forEach((constName) => {
            let constData = jsonData[constName];
            
            if(typeof constData == 'object'){
                CharaData[charaName].Const[constName] = CharaData.fixValue(constData.unit, constData.value);
            } else {
                CharaData[charaName].Const[constName] = constData;
            }
        });
    }

    static loadConst(jsonData) {
        let constNames = Object.keys(jsonData);
        CharaData.Const = {};

        constNames.forEach((constName) => {
            let constData = jsonData[constName];
            console.log(constData);
            if(typeof constData == 'object'){
                CharaData.Const[constName] = CharaData.fixValue(constData.unit, constData.value);
            } else {
                CharaData.Const[constName] = constData;
            }
        });
    }

    static updateSuffix(suffixKind, suffixId, value) {
        let ranges = CharaData.StateSuffix.Ranges[suffixKind];

        if(CharaData.isInRange(value, ranges[suffixId])){
            return suffixId;
        }else{
            let margin = Math.floor(ranges.length / 2);
            for(let idX = 1; idX <= margin; idX++){
                {
                    let id = CharaData.loopId(suffixId + idX, ranges.length);
                    if(CharaData.isInRange(value, ranges[id])){
                        return id;
                    }
                }

                {
                    let id = CharaData.loopId(suffixId - idX, ranges.length);
                    if(CharaData.isInRange(value, ranges[id])){
                        return id;
                    }
                }
            }

            return suffixId;
        }
    }

    static fixValue(unit, value) {
        if (unit === null) {
            return value;
        }

        if (unit == 'deg') {
            value *= Math.PI / 180;
        }

        return value;
    }

    static fixRange(unit, range) {
        if (unit === null) {
            return range;
        } else {
            for (let i = 0; i < 2; i++) {
                range[i] = CharaData.fixValue(unit, range[i]);
            }

            return range;
        }
    }

    static loopId(id, length) {
        while(id < 0){
            id += length;
        }

        while(id >= length){
            id -= length;
        }

        return id;
    }

    static judgeValue(x, rangeOrValue) {
        if (typeof (rangeOrValue) == 'array') {
            return isInRange(x, rangeOrValue);
        } else {
            return x === rangeOrValue;
        }
    }

    static isInRange(x, range) {
        let upper = range[1], lower = range[0];

        if (upper === null && lower === null)
            return true;
        else if (upper === null) {
            return x > lower;
        } else if (lower === null) {
            return x < upper;
        } else if (upper > lower) {
            return x < upper && x > lower;
        } else {
            return x < upper || x > lower;
        }
    }

    static getVar(chara, stateName) {
        let value = chara;
        let varChain = CharaData[chara.constructor.name].State[stateName].useSuffix.var;

        for(let i = 0; i < varChain.length; i++) {
            value = value[varChain[i]];
        }

        return value;
    }
}

class CharaState {
    constructor(chara, stateName) {
        this.chara = chara;
        this.change = true;
        this.stateName = stateName;
        this.suffixKind = CharaData[this.chara.constructor.name].State[this.stateName].useSuffix.kind;
        this.changeSuffix(0);
    }

    //ループの最初に置く
    resetFlag() {
        this.change = false;
    }

    changeSuffix(suffixId) {
        if(this.suffixId != suffixId) {
            this.suffixId = suffixId;
            this.suffixName = CharaData.StateSuffix.IdAndNames[this.suffixKind].name(this.suffixId);
            this.change = true;
        }
    }

    changeState(stateName) {
        this.stateName = stateName;
        let newSuffixKind = CharaData[this.chara.constructor.name].State[this.stateName].useSuffix.kind;

        if(this.suffixKind != newSuffixKind){
            this.suffixKind = newSuffixKind;

            if(this.suffixKind != undefined) {
                this.suffixId = 0;
                this.updateSuffix();
            }
        }
    }

    getAtrName() {
        return this.stateName + this.suffixName;
    }

    //suffixkindがundefinedのときはダメ
    updateSuffix() {
        let value = CharaData.getVar(this.chara, this.stateName);
        this.changeSuffix(CharaData.updateSuffix(this.suffixKind, this.suffixId, value));
    }
}

class Movement {
    constructor(app) {
        this.app = app;
        this.pos = new Vector3(0, 0, 0);
        this.vel = new Vector3(0, 0, 0);
        this.acc = new Vector3(0, 0, 0);
    }

    updatePos(deltaTime) {
        this.vel = this.vel.add(this.acc.times(deltaTime));
        this.pos = this.pos.add(this.vel.times(deltaTime));
    }

    drawPoint() {
        let point = new Vector2(0, 0);

        point.x = this.pos.x * Math.ONE_OF_ROOT2 + this.pos.y * Math.ONE_OF_ROOT2;
        point.y = -this.pos.x * Math.ONE_OF_ROOT2 + this.pos.y * Math.ONE_OF_ROOT2;
        point.y /= 2;
        point.y += this.pos.z + CharaData.Const.mapLengthZ;

        return point;
    }

    static pointerToPoint(pointerPos) {
        let pointer = pointerPos.copy();
        let point = new Vector3(0, 0, 0);

        pointer.y -= CharaData.Const.mapLengthZ;
        pointer.y *= 2;
        point.x = pointer.x * Math.ONE_OF_ROOT2 - pointer.y * Math.ONE_OF_ROOT2;
        point.y = pointer.x * Math.ONE_OF_ROOT2 + pointer.y * Math.ONE_OF_ROOT2;

        return point;
    }
}

//1spriteのみ
class Chara extends Movement {
    constructor(app, stateName) {
        super(app);
        this.state = new CharaState(this, stateName);
        this.imgName = CharaData[this.constructor.name].Const.imgName;
        this.sprite = new ExSprite(this.app, this.imgName, this.state.getAtrName());

        this.app.stage.addChild(this.sprite);
    }

    loopAll(deltaTime) {
        this.state.resetFlag();

        this.loop(deltaTime);
        this[this.state.stateName](deltaTime);
        this.updatePos(deltaTime);

        if(this.state.change){
            this.updateTexture();
        }
        
        this.sprite.updatePos(this.drawPoint());
    }

    updateTexture() {
        this.sprite.changeTextures(this.imgName, this.state.getAtrName());
    }
}

$.ajaxSetup({ async: false });
CharaData.load();
$.ajaxSetup({ async: true });