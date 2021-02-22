import { Config } from '~/config'
import { TutorialScene } from './tutorialScene'
export type TutorialState = 'start' | 'middle' | 'end'

export class TutorialStartEndScene extends Phaser.Scene {
    public tutorialScene: TutorialScene
    public container: Phaser.GameObjects.Container
    public text: Phaser.GameObjects.Text
    public state: TutorialState
    public clickInput: Phaser.Input.InputPlugin

    constructor() {
        super({ key: Config.scenes.keys.tutorialStartEnd })
    }

    init() {
        this.scale.on(
            'resize',
            () => {
                this.text.setPosition(
                    this.scale.width * 0.5,
                    this.scale.height * 0.5 + Config.panels.board.height * 0.5
                )
            },
            false
        )
        this.events.on('shutdown', () => {
            this.input.off(Phaser.Input.Events.POINTER_DOWN)
        })

        this.tutorialScene = this.scene.get(Config.scenes.keys.tutorial) as TutorialScene
        this.registerClick()
    }

    create() {
        this.text = this.add.text(
            this.scale.width * 0.5,
            this.scale.height * 0.5 + Config.panels.board.height * 0.5,
            '',
            Config.scenes.tutorialStartEndScene.styles.text
        )
        this.text.setOrigin(0.5, 0.5)
    }

    setText(text: string) {
        this.text.setText(text)
    }

    registerClick() {
        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.state === 'end') {
                this.handleEndTutorial()
            } else {
                this.handleNextTutorial()
            }
        })
    }

    handleNextTutorial() {
        this.scene.resume(Config.scenes.keys.tutorial)
        this.scene.sleep(Config.scenes.keys.tutorialStartEnd)
    }

    handleEndTutorial() {
        this.scene.start(Config.scenes.keys.menu)
        this.scene.stop(Config.scenes.keys.tutorial)
        this.scene.stop(Config.scenes.keys.tutorialStartEnd)
    }
}
