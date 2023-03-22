window.addEventListener('load', () => {
    new Main();
});

class Main{
    static get IMG_ATR_NAMES_PATH(){ return './data/imgAtrNames.json' }
    static get APP_ELM(){ return $('#app') }
    static get APP_DIC_PATH(){ return './data/appDic.json' }

    constructor() {
        $.ajaxSetup({ async: false });

        $.getJSON(Main.IMG_ATR_NAMES_PATH, (data => {
            this.imgAtrNames = data;
        }).bind(this));

        $.getJSON(Main.APP_DIC_PATH, (data => {
            this.appDic = data;
        }).bind(this));

        this.app = new ExApp(Main.APP_ELM, this.imgAtrNames, this.appDic);
        this.app.loader.load(() => {
            this.app.setState(new Demo(this.app));
        });

        $.ajaxSetup({ async: true });
    }
}