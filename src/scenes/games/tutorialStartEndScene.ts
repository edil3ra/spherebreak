import { Config } from '~/config'
import { TutorialScene } from './tutorialScene'

export type TutorialState = 'start' | 'end'

export class TutorialStartEndScene extends Phaser.Scene {
    public tutorialScene: TutorialScene
    public container: Phaser.GameObjects.Container
    public text: Phaser.GameObjects.Text
    public state: TutorialState

    constructor() {
        super({ key: Config.scenes.keys.tutorialStartEnd })
    }

    init() {
        this.tutorialScene = this.scene.get(Config.scenes.keys.tutorial) as TutorialScene
        // this.events.on('wake', () => {
        //     this.showText()
        // })
        this.registerClick()
    }

    create() {
        this.text = this.add.text(
            this.scale.width * 0.5,
            this.scale.height * 0.5 - 10,
            '',
            Config.scenes.tutorialStartEndScene.styles.text
        )
        this.text.setOrigin(0.5, 0.5)
    }

    setText(text: string) {
        this.text.setText(text)
    }
    
    // showText() {
        // const stateToText = {
        //     start: 'Welcome, Tap to start the tutorial!',
        //     middle: '_',
        //     end: 'Tap to end the tutorial!',
        // }
        // this.text.setText(stateToText[this.tutorialScene.tutorialState])
        // this.text.setText(this.texts[this.state])
    // }
    
    registerClick() {
        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            console.log('cliced')
            if (this.state === 'end') {
                this.handleEndTutorial()
            }
            else {
                this.handleNextTutorial()
            }
        })
    }

    handleNextTutorial() {
        this.scene.resume(Config.scenes.keys.tutorial)
        this.scene.sleep(Config.scenes.keys.tutorialStartEnd)
    }

    handleEndTutorial() {
        this.scene.stop(Config.scenes.keys.tutorial)
        this.scene.stop(Config.scenes.keys.tutorialStartEnd)
        this.scene.start(Config.scenes.keys.menu)
    }
}
