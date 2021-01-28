import { Config } from "~/config"


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
            .setStyle(Config.panels.board.styles.timer)
        this.setTimerText(0)
    }


    setTimerText(timer: number) {
        if(timer < 10) {
            this.timerText.setText(` ${timer}`)
                        // this.timerText.setText(`${timer}`)
        } else {
            this.timerText.setText(`${timer}`)
        }
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.timerText,
        ])
    }
}
