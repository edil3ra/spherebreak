import { Config } from "~/config"
import { GameScene } from "~/scenes/games"

const textStyle = {
    ...Config.panels.board.textStyle,
    fontSize: '42px',
}

export class BoardMiddlePanel {
    public scene: Phaser.Scene
    public container: Phaser.GameObjects.Container
    public timerText: Phaser.GameObjects.Text


    constructor(scene: Phaser.Scene) {
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
        this.setTimerText(0)
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
