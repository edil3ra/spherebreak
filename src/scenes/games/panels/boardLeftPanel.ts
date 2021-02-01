import { Config } from '~/config'

export class BoardLeftPanel {
    public scene: Phaser.Scene
    public container: Phaser.GameObjects.Container

    public prefixTurnText: Phaser.GameObjects.Text
    public currentTurnText: Phaser.GameObjects.Text
    public separatorTurnText: Phaser.GameObjects.Text
    public maxTurnText: Phaser.GameObjects.Text

    public prefixQuotaText: Phaser.GameObjects.Text
    public currentQuotaText: Phaser.GameObjects.Text
    public separatorQuotaText: Phaser.GameObjects.Text
    public maxQuotaText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public create() {
        this.initTurnText()
        this.initQuotaText()
        this.initContainer()
    }

    initTurnText() {
        this.prefixTurnText = this.scene.add
            .text(0, 0, 'Turn')
            .setPosition(0, 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.currentTurnText = this.scene.add
            .text(0, 0, '0')
            .setPosition(72, 8)
            .setOrigin(1, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.separatorTurnText = this.scene.add
            .text(0, 0, '/')
            .setPosition(76, 8)
            .setOrigin(0.5, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.maxTurnText = this.scene.add
            .text(0, 0, '0')
            .setPosition(80, 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)
    }

    initQuotaText() {
        this.prefixQuotaText = this.scene.add
            .text(0, 0, 'Quota')
            .setPosition(0, Config.panels.board.offsetItem + 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.currentQuotaText = this.scene.add
            .text(0, 0, '0')
            .setPosition(72, Config.panels.board.offsetItem + 8)
            .setOrigin(1, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.separatorQuotaText = this.scene.add
            .text(0, 0, '/')
            .setPosition(76, Config.panels.board.offsetItem + 8)
            .setOrigin(0.5, 0.5)
            .setStyle(Config.panels.board.styles.text)

        this.maxQuotaText = this.scene.add
            .text(0, 0, '0')
            .setPosition(80, Config.panels.board.offsetItem + 8)
            .setOrigin(0, 0.5)
            .setStyle(Config.panels.board.styles.text)
    }

    setTurnText(turn: number, maxTurn: number) {
        this.scene.tweens.add({
            ...Config.panels.board.tweens.base,
            targets: [this.currentTurnText, this.maxTurnText],
            onComplete: () => {
                const maxPadding = Math.floor(Math.log10(maxTurn))
                const currentPadding = Math.floor(Math.log10(turn))
                const padding = maxPadding - currentPadding
                const paddingText = padding !== Infinity ? '0'.repeat(padding) : '0'.repeat(maxPadding)
                this.currentTurnText.setText(`${paddingText}${turn}`)
                this.maxTurnText.setText(`${maxTurn}`)
            },
        })
    }

    setQuotaText(quota: number, maxQuota: number) {
        this.scene.tweens.add({
            ...Config.panels.board.tweens.base,
            targets: [this.currentQuotaText, this.maxQuotaText],
            onComplete: () => {
                const maxPadding = Math.floor(Math.log10(maxQuota))
                const currentPadding = Math.floor(Math.log10(quota))
                const padding = maxPadding - currentPadding
                const paddingText = padding !== Infinity ? '0'.repeat(padding) : '0'.repeat(maxPadding)
                this.currentQuotaText.setText(`${paddingText}${quota}`)
                this.maxQuotaText.setText(`${maxQuota}`)
            }
        })
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.prefixTurnText,
            this.currentTurnText,
            this.separatorTurnText,
            this.maxTurnText,
            this.prefixQuotaText,
            this.currentQuotaText,
            this.separatorQuotaText,
            this.maxQuotaText,
        ])
    }
}
