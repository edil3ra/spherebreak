import { Button } from '~/ui/button'
import { ButtonContainer } from '~/ui/buttonContainer'






export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' })
    }
    public buttonPlay: ButtonContainer
    public buttonTutorial: ButtonContainer
    
    create () {
        // this.add.image(0, 0, 'b1')
        //     .setOrigin(0, 0)
        //     .setDisplaySize(
        //         this.scale.width,
        //         this.scale.height,
        //     )
        // this.cameras.main.setZoom(2)
        
        // const button = new Button(this, 500, 500, 'pb1', 0xDDDDDD)
        //     .setUpTint(0xCCCCCC)
        //     .setOverTint(0xEEEEEE)
        //     .setDownTint(0xF8F8F8)
        //     .setScale(2)
        //     .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, (pointer: Phaser.Input.Pointer) => {
        //         console.log('hello')
        //     })
        this.setButtonPlay()
        this.setButtonTutorial()




        this.add.container(100, 100, [this.buttonPlay, this.buttonTutorial])
    }


    public setButtonPlay() {
        this.buttonPlay = this.add.buttonContainer(0, 0, 'pb1', 0xDDDDDD)
            .setUpTint(0xCCCCCC)
            .setOverTint(0xEEEEEE)
            .setDownTint(0xF8F8F8)
            .setScale(2)
            .setText('Play')
        this.buttonPlay.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlay)        
    }


    public setButtonTutorial() {
        this.buttonTutorial = this.add.buttonContainer(240, 0, 'pb1', 0xDDDDDD)
            .setUpTint(0xCCCCCC)
            .setOverTint(0xEEEEEE)
            .setDownTint(0xF8F8F8)
            .setScale(2)
            .setText('Tutorial')
        this.buttonTutorial.button.setScale(1.6, 1)
        this.buttonTutorial.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleTutorial)
    }
    
    
    public handleTutorial(pointer: Phaser.Input.Pointer) {
        console.log('Tutorial')
    }

    public handlePlay(pointer: Phaser.Input.Pointer) {
        console.log('Play')
    }
    
}
