class CharaAtr{
    static get RANGES_PATH(){ return './data/charaAtrRanges.json' }

    constructor(stateName, atrName) {
        this.stateName = stateName;
        this.atrName = atrName;
    }

    static judge(imgName, nowStateName, nowAtrName, vector) {
        let stateName = nowStateName;
        let atrName = nowAtrName;
        let imgId = CharaAtr.IMG_ID_AND_NAMES.id(imgName);
        let stateId = CharaAtr.STATE_ID_AND_NAMES[imgId].id(stateName);
        let atrId = CharaAtr.ATR_ID_AND_NAMES[imgId][stateId].id(atrName);

        let upperRange = CharaAtr.UPPER_RANGES[imgId];
        let lowerRange = CharaAtr.LOWER_RANGES[imgId];
        let magn = vector.getMagn();
        let rad = vector.getRad();

        if(!CharaAtr.isInRange(magn, upperRange[stateId].magn, lowerRange[stateId].magn)){
            let stateIdAndName = CharaAtr.STATE_ID_AND_NAMES[imgId];

            for(let idX = 1; idX <= Math.floor(stateIdAndName.size / 2); idX++){
                {
                    let id = CharaAtr.idInRange(stateId + idX, stateIdAndName.size);

                    if(CharaAtr.isInRange(magn, upperRange[id].magn, lowerRange[id].magn)){
                        stateName = stateIdAndName.name(id);
                        stateId = id;
                        break;
                    }
                }
                
                {
                    let id = CharaAtr.idInRange(stateId - idX, stateIdAndName.size);

                    if(CharaAtr.isInRange(magn, upperRange[id].magn, lowerRange[id].magn)){
                        stateName = stateIdAndName.name(id);
                        stateId = id;
                        break;
                    }
                }
            }
        }

        upperRange = CharaAtr.UPPER_RANGES[imgId][stateId];
        lowerRange = CharaAtr.LOWER_RANGES[imgId][stateId];

        if(CharaAtr.isInRange(rad, upperRange.rad[atrId], lowerRange.rad[atrId])){
            return [stateName, atrName];
        }else{
            let atrIdAndName = CharaAtr.ATR_ID_AND_NAMES[imgId][stateId];

            for(let idX = 1; idX <= Math.floor(atrIdAndName.size / 2); idX++){
                {
                    let id = CharaAtr.idInRange(atrId + idX, atrIdAndName.size);

                    if(CharaAtr.isInRange(rad, upperRange.rad[id], lowerRange.rad[id])){
                        atrName = atrIdAndName.name(id);
                        atrId = id;
                        break;
                    }
                }
                
                {
                    let id = CharaAtr.idInRange(atrId - idX, atrIdAndName.size);

                    if(CharaAtr.isInRange(rad, upperRange.rad[id], lowerRange.rad[id])){
                        atrName = atrIdAndName.name(id);
                        atrId = id;
                        break;
                    }
                }
            }

            return [stateName, atrName];
        }
    }

    /*
    static getUpperRanges(imgName, stateName) {
        return CharaAtr.UPPER_RANGES[imgName][stateName];
    }

    static getLowerRanges(imgName, stateName) {
        return CharaAtr.UPPER_RANGES[imgName][stateName];
    }
    */

    static idInRange(id, length) {
        while(id < 0){
            id += length;
        }

        while(id >= length){
            id -= length;
        }

        return id;
    }

    static isInRange(x, upper, lower) {
        if (upper === null && lower === null)
            return true;
        else if(upper === null){
            return x > lower;
        }else if(lower === null){
            return x < upper;
        }else if(upper > lower){
            return x < upper && x > lower;
        }else{
            return x < upper || x > lower;
        }
    }
}


// すべての階層を辞書型にするのではなく、それぞれの階層に属性名→idを設定したものを用意するといいかも。
// imgNameToIds = {'NameA': 0,...};
// stateNameToIds = [{'StateA':0,...}(これはNameAのidと一致する),...];
// atrNameToIds = [[{'atrA':0,...}(これはStateAのidと一致する),...](これはNameAのidと一致する),...];
// という感じにする。

$.ajaxSetup({ async: false });
$.getJSON(CharaAtr.RANGES_PATH, (json_data) => {
    let upperRanges = [];
    let lowerRanges = [];
    let imgIdAndNames = new IdAndName();
    let stateIdAndNames = [];
    let atrIdAndNames = [];
    let imgNames = Object.keys(json_data);

    imgNames.forEach((imgName) => {
        let stateNames = Object.keys(json_data[imgName]);
        let imgId = imgIdAndNames.push(imgName);
        upperRanges.push([]);
        lowerRanges.push([]);
        stateIdAndNames.push(new IdAndName());
        atrIdAndNames.push([]);

        stateNames.forEach((stateName) => {
            let unitNames = Object.keys(json_data[imgName][stateName]);
            let stateId = stateIdAndNames[imgId].push(stateName);

            upperRanges[imgId].push({});
            lowerRanges[imgId].push({});
            atrIdAndNames[imgId].push(new IdAndName());
            
            unitNames.forEach((unitName) => {
                if(unitName === 'deg'){
                    let atrNames = Object.keys(json_data[imgName][stateName][unitName]);

                    upperRanges[imgId][stateId].rad = [];
                    lowerRanges[imgId][stateId].rad = [];
                    
                    atrNames.forEach((atrName) => {
                        let range = json_data[imgName][stateName][unitName][atrName];

                        atrIdAndNames[imgId][stateId].push(atrName);
                        upperRanges[imgId][stateId].rad.push(range[1] * Math.PI / 180);
                        lowerRanges[imgId][stateId].rad.push(range[0] * Math.PI / 180);
                    });
                }else if(unitName === 'magn'){
                    let range = json_data[imgName][stateName][unitName];

                    upperRanges[imgId][stateId][unitName] = range[1];
                    lowerRanges[imgId][stateId][unitName] = range[0];
                }
            });
        });
    });

    CharaAtr.UPPER_RANGES = upperRanges;
    CharaAtr.LOWER_RANGES = lowerRanges;
    CharaAtr.IMG_ID_AND_NAMES = imgIdAndNames;
    CharaAtr.STATE_ID_AND_NAMES = stateIdAndNames;
    CharaAtr.ATR_ID_AND_NAMES = atrIdAndNames;
});
$.ajaxSetup({ async: true });