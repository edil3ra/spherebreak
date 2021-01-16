import { Config } from "~/config"
import { GameScene } from "~/scenes/gameScene"

const textStyle = {
    ...Config.scenes.game.boardPanel.textStyle,
    fontSize: '42px',
}

export class BoardMiddlePanel {
    public scene: GameScene
    public container: Phaser.GameObjects.Container
    public timerText: Phaser.GameObjects.Text


    constructor(scene: GameScene) {
        this.scene = scene
    }

    public create() {
        this.initTimerText()
        this.initContainer()
    }


    initTimerText() {
        this.timerText = this.scene.add.text(0, 0, '')
            .setPosition(0, 0)
            .setStyle(textStyle)
        this.setTimerText(this.scene.data.maxTimer)
    }


    setTimerText(timer: number) {
        this.timerText.setText(`${timer}`)
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.timerText,
        ])
    }
}
