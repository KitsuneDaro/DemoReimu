class CharaAtr{
    static get RANGES_PATH(){ return './data/charaAtrRanges.json' }

    static judge(imgName, nowStateName, nowAtrName, vector) {
        let atrName = nowAtrName;
        let stateName = nowStateName;
        let nowId = CharaAtr.ATR_NAME_TO_IDS[imgName][stateName][atrName];
        let upperRange = CharaAtr.UPPER_RANGES[imgName][stateName];
        let lowerRange = CharaAtr.LOWER_RANGES[imgName][stateName];
        let magn = vector.getMagn();
        let rad = vector.getRad();

        if(!CharaAtr.isInRange(magn, upperRange.magn, lowerRange.magn)){
            /*
            let atrIdToName = CharaAtr.ATR_ID_TO_NAMES[imgName][stateName];

            for(let idX = 1; idX < atrIdToName.length; idX++){
                {
                    let id = CharaAtr.idInRange(nowId + idX, atrIdToName.length);

                    if(CharaAtr.isInRange(rad, upperRange.rad[id], lowerRange.rad[id])){
                        atrName = atrIdToName[id];
                        break;
                    }
                }
                
                {
                    let id = CharaAtr.idInRange(nowId - idX, atrIdToName.length);

                    if(CharaAtr.isInRange(rad, upperRange.rad[id], lowerRange.rad[id])){
                        atrName = atrIdToName[id];
                        break;
                    }
                }
            }
            */
        }

        if(CharaAtr.isInRange(rad, upperRange.rad[nowId], lowerRange.rad[nowId])){
            return (stateName, atrName);
        }else{
            let atrIdToName = CharaAtr.ATR_ID_TO_NAMES[imgName][stateName];

            for(let idX = 1; idX < atrIdToName.length; idX++){
                {
                    let id = CharaAtr.idInRange(nowId + idX, atrIdToName.length);

                    if(CharaAtr.isInRange(rad, upperRange.rad[id], lowerRange.rad[id])){
                        atrName = atrIdToName[id];
                        break;
                    }
                }
                
                {
                    let id = CharaAtr.idInRange(nowId - idX, atrIdToName.length);

                    if(CharaAtr.isInRange(rad, upperRange.rad[id], lowerRange.rad[id])){
                        atrName = atrIdToName[id];
                        break;
                    }
                }
            }

            return (stateName, atrName);
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
        if(upper === null){
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
    let upperRanges = {};
    let lowerRanges = {};
    let atrIdToNames = {};
    let atrNameToIds = {};
    let imgNames = Object.keys(json_data);

    imgNames.forEach((imgName) => {
        let stateNames = Object.keys(json_data[imgName]);
        upperRanges[imgName] = {};
        lowerRanges[imgName] = {};
        atrIdToNames[imgName] = {};
        atrNameToIds[imgName] = {};

        stateNames.forEach((stateName) => {
            let unitNames = Object.keys(json_data[imgName][stateName]);
            upperRanges[imgName][stateName] = {};
            lowerRanges[imgName][stateName] = {};
            atrIdToNames[imgName][stateName] = [];
            atrNameToIds[imgName][stateName] = {};
            
            unitNames.forEach((unitName) => {
                if(unitName === 'deg'){
                    let atrNames = Object.keys(json_data[imgName][stateName][unitName]);
                    let id = 0;
                    upperRanges[imgName][stateName].rad = [];
                    lowerRanges[imgName][stateName].rad = [];
                    
                    atrNames.forEach((atrName) => {
                        let range = json_data[imgName][stateName][unitName][atrName];

                        upperRanges[imgName][stateName].rad.push(range[1] * Math.PI / 180);
                        lowerRanges[imgName][stateName].rad.push(range[0] * Math.PI / 180);
                        atrIdToNames[imgName][stateName].push(atrName);
                        atrNameToIds[imgName][stateName][atrName] = id;

                        id++;
                    });
                }else if(unitName === 'magn'){
                    let range = json_data[imgName][stateName][unitName];

                    upperRanges[imgName][stateName][unitName] = range[1];
                    lowerRanges[imgName][stateName][unitName] = range[0];
                }
            });
        });
    });

    CharaAtr.UPPER_RANGES = upperRanges;
    CharaAtr.LOWER_RANGES = lowerRanges;
    CharaAtr.ATR_ID_TO_NAMES = atrIdToNames;
    CharaAtr.ATR_NAME_TO_IDS = atrNameToIds;
});
$.ajaxSetup({ async: true });