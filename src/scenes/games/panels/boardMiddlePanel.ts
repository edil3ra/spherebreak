import { Config } from '~/config'

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
        this.timerText = this.scene.add
            .text(0, 0, '')
            .setPosition(0, 0)
            .setOrigin(0.5, 0.5)
            .setStyle(Config.panels.board.styles.timer)
        this.resetTimerText(0)
    }

    resetTimerText(timer: number) {
        this.scene.tweens.add({
            ...Config.panels.board.tweens.resetTimer,
            targets: [this.timerText],
            onComplete: () => {
                this.timerText.setText(` ${timer}`)
            },
        })
    }
    
    setTimerText(timer: number) {
        this.scene.tweens.add({
            ...Config.panels.board.tweens.setTimer,
            targets: [this.timerText],
            onComplete: () => {
                this.timerText.setText(` ${timer}`)
            },
        })
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [this.timerText])
    }
}
