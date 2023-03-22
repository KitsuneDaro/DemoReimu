class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.z = 0;
    }

    static get ZERO() {
        return new Vector2(0, 0);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    add(v) {
        let x, y;
        x = this.x + v.x;
        y = this.y + v.y;
        return new Vector2(x, y);
    }

    sub(v) {
        let x, y;
        x = this.x - v.x;
        y = this.y - v.y;
        return new Vector2(x, y);
    }

    times(k) {
        let x, y;
        x = this.x * k;
        y = this.y * k;
        return new Vector2(x, y);
    }

    mul(k) {
        return this.times(1 / k);
    }

    normal() {
        if (this.getMagn() > 0) {
            return this.mul(this.magn);
        } else {
            return Vector2.ZERO;
        }
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    getMagnSq() {
        if (this.magnSq === undefined) {
            this.magnSq = this.x * this.x + this.y * this.y;
        }

        return this.magnSq;
    }

    getMagn() {
        if (this.magn === undefined) {
            this.magn = Math.sqrt(this.getMagnSq());
        }

        return this.magn;
    }

    setX(x) {
        return new Vector2(x, this.y);
    }

    setY(y) {
        return new Vector2(this.x, y);
    }

    //Vector2のみ
    inRect(rect) {
        return (
            this.x >= rect.x &&
            this.x < rect.x + rect.width &&
            this.y >= rect.y &&
            this.y < rect.y + rect.height
        );
    }

    getRad() {
        if (this.rad === undefined) {
            this.rad = Math.atan2(this.y, this.x);
        }

        return this.rad;
    }
}

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static get ZERO() {
        return new Vector3(0, 0, 0);
    }

    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    add(v) {
        let x, y, z;
        x = this.x + v.x;
        y = this.y + v.y;
        z = this.z + v.z;
        return new Vector3(x, y, z);
    }

    sub(v) {
        let x, y, z;
        x = this.x - v.x;
        y = this.y - v.y;
        z = this.z - v.z;
        return new Vector3(x, y, z);
    }

    times(k) {
        let x, y, z;
        x = this.x * k;
        y = this.y * k;
        z = this.z * k;
        return new Vector3(x, y, z);
    }

    mul(k) {
        return this.times(1 / k);
    }

    normal() {
        if (this.getMagn() > 0) {
            return this.mul(this.magn);
        } else {
            return Vector3.ZERO;
        }
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    getMagnSq() {
        if (this.magnSq === undefined) {
            this.magnSq = this.x * this.x + this.y * this.y + this.z * this.z;
        }

        return this.magnSq;
    }

    getMagn() {
        if (this.magn === undefined) {
            this.magn = Math.sqrt(this.getMagnSq());
        }

        return this.magn;
    }

    setX(x) {
        return new Vector3(x, this.y, this.z);
    }

    setY(y) {
        return new Vector3(this.x, y, this.z);
    }

    setZ(z) {
        return new Vector3(this.x, this.y, z);
    }

    //Vector3のみ
    getVecXY() {
        return new Vector2(this.x, this.y);
    }

    getRadXY() {
        if (this.radXY === undefined) {
            this.radXY = this.getVecXY().getRad();
        }

        return this.radXY;
    }
}

class IdAndName {
    constructor() {
        this.nameToId = {};
        this.idToName = [];
        this.size = 0;
    }

    push(name) {
        let id = this.idToName.length;
        this.nameToId[name] = id;
        this.idToName.push(name);
        this.size++;

        return id;
    }

    id(name) {
        return this.nameToId[name];
    }

    name(id) {
        return this.idToName[id];
    }
}

class KeyBoard {
    static keyPress(e) {
        KeyBoard.key[e.code] = true;
    }

    static keyUp(e) {
        KeyBoard.key[e.code] = false;
    }
}

KeyBoard.key = {};
document.addEventListener('keypress', KeyBoard.keyPress);
document.addEventListener('keyup', KeyBoard.keyUp);

Math.ROOT2 = Math.sqrt(2);
Math.ONE_OF_ROOT2 = 1 / Math.sqrt(2);