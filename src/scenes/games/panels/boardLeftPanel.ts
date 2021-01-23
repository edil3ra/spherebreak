import { Config } from "~/config"
import { GameScene } from "~/scenes/games"

const OFFSET_ITEM = 20

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
            .setStyle(Config.scenes.game.boardPanel.textStyle)
        this.setTurnText(0, 0)
    }

    initQuotaText() {
        this.quotaText = this.scene.add.text(0, 0, '')
            .setPosition(0, Config.scenes.game.boardPanel.offsetItem)
            .setStyle(Config.scenes.game.boardPanel.textStyle)
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
