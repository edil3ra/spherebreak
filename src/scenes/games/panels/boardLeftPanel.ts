import { Config } from "~/config"

export class BoardLeftPanel {
    public scene: Phaser.Scene
    public container: Phaser.GameObjects.Container
    public turnText: Phaser.GameObjects.Text
    public quotaText: Phaser.GameObjects.Text
    

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public create() {
        this.initTurnText()
        this.initQuotaText()
        this.initContainer()
    }


    initTurnText() {
        this.turnText = this.scene.add.text(0, 0, '')
            .setPosition(0)
            .setStyle(Config.panels.board.styles.text)
        this.setTurnText(0, 0)
    }

    initQuotaText() {
        this.quotaText = this.scene.add.text(0, 0, '')
            .setPosition(0, Config.panels.board.offsetItem)
            .setStyle(Config.panels.board.styles.text)
        this.setQuotaText(0, 0)
    }


    setTurnText(turn: number, maxTurn: number) {
        this.turnText.setText(`Turn         ${turn} / ${maxTurn}`)
    }


    setQuotaText(quota: number, maxQuota: number) {
        this.quotaText.setText(`Quota      ${quota} / ${maxQuota}`)
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.turnText,
            this.quotaText,
        ])
    }

    
}
