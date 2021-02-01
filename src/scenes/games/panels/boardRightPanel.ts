import { Config } from '~/config'

export class BoardRightPanel {
    public scene: Phaser.Scene
    public container: Phaser.GameObjects.Container

    public prefixComboMultipleText: Phaser.GameObjects.Text
    public currentComboMultipleText: Phaser.GameObjects.Text
    public separatorComboMultipleText: Phaser.GameObjects.Text
    public goalComboMultipleText: Phaser.GameObjects.Text

    public prefixComboCountText: Phaser.GameObjects.Text
    public currentComboCountText: Phaser.GameObjects.Text
    public separatorComboCountText: Phaser.GameObjects.Text
    public goalComboCountText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public create() {
        this.initComboMultipleText()
        this.initComboCountText()
        this.initContainer()
    }

    initComboMultipleText() {
        this.prefixComboMultipleText = this.scene.add
            .text(0, 0, 'Multiple')
            .setPosition(0, 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.currentComboMultipleText = this.scene.add
            .text(0, 0, '0')
            .setPosition(68, 8)
            .setOrigin(1, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.separatorComboMultipleText = this.scene.add
            .text(0, 0, '->')
            .setPosition(80, 8)
            .setOrigin(0.5, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.goalComboMultipleText = this.scene.add
            .text(0, 0, '0')
            .setPosition(92, 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)
    }

    initComboCountText() {
        this.prefixComboCountText = this.scene.add
            .text(0, 0, 'Count')
            .setPosition(0, Config.panels.board.offsetItem + 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.currentComboCountText = this.scene.add
            .text(0, 0, '0')
            .setPosition(68, Config.panels.board.offsetItem + 8)
            .setOrigin(1, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.separatorComboCountText = this.scene.add
            .text(0, 0, '->')
            .setPosition(80, Config.panels.board.offsetItem + 8)
            .setOrigin(0.5, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.goalComboCountText = this.scene.add
            .text(0, 0, '0')
            .setPosition(92, Config.panels.board.offsetItem + 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)
    }

    setComboMultipleText(comboMultple: number, comboMultipleGoal: number | null) {
        this.scene.tweens.add({
            ...Config.panels.board.tweens.base,
            targets: [this.currentComboMultipleText, this.goalComboMultipleText],
            onComplete: () => {
                this.currentComboMultipleText.setText(`${comboMultple}`)
                this.goalComboMultipleText.setText(`${comboMultipleGoal || '-'}`)
            },
        })
    }

    setComboCountText(comboCount: number, comboCountGoal: number | null) {
        this.scene.tweens.add({
            ...Config.panels.board.tweens.base,
            targets: [this.currentComboCountText, this.goalComboCountText],
            onComplete: () => {
                this.currentComboCountText.setText(`${comboCount}`)
                this.goalComboCountText.setText(`${comboCountGoal || '-'}`)
            },
        })
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.prefixComboMultipleText,
            this.currentComboMultipleText,
            this.separatorComboMultipleText,
            this.goalComboMultipleText,
            this.prefixComboCountText,
            this.currentComboCountText,
            this.separatorComboCountText,
            this.goalComboCountText,
        ])
    }
}
