
export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'boot' })
    }


    preload(): void {
        this.load.image('p1', 'assets/images/patterns/t2.png')
        this.load.image('pb1', 'assets/images/interface/button_rectangleWood.png')
        this.load.image('pw1', 'assets/images/interface/panel_wood.png')
        this.load.image('pw2', 'assets/images/interface/panel_woodDetail.png')
        this.load.image('pw3', 'assets/images/interface/panel_woodDetailSquare.png')
        this.facebook.once('startgame', this.startGame, this)
        this.facebook.showLoadProgress(this)
    }

    startGame ()
    {
        this.scene.start('menu')
    }

}
