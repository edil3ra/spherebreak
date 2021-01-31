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
        this.setTimerText(0)
    }

    setTimerText(timer: number) {
        this.scene.tweens.add({
            targets: [this.timerText],
            scale: {
                from: 1.2,
                to: 1,
            },
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.timerText.setText(` ${timer}`)
            },
            duration: Config.scenes.game.afterTurnTimer / 2,
        })
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [this.timerText])
    }
}
