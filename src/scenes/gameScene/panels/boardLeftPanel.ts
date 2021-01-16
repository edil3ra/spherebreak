import { Config } from "~/config"
import { GameScene } from "~/scenes/gameScene"

const OFFSET_ITEM = 20

export class BoardLeftPanel {
    public scene: GameScene
    public container: Phaser.GameObjects.Container
    public turnText: Phaser.GameObjects.Text
    public quotaText: Phaser.GameObjects.Text
    

    constructor(scene: GameScene) {
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
        this.setTurnText(0)
    }

    initQuotaText() {
        this.quotaText = this.scene.add.text(0, 0, '')
            .setPosition(0, Config.scenes.game.boardPanel.offsetItem)
            .setStyle(Config.scenes.game.boardPanel.textStyle)
        this.setQuotaText(0)
    }


    setTurnText(turn: number) {
        this.turnText.setText(`Turn         ${turn}/${this.scene.data.maxTurn}`)
    }


    setQuotaText(quota: number) {
        this.quotaText.setText(`Quota      ${quota}/${this.scene.data.maxQuota}`)
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.turnText,
            this.quotaText,
        ])
    }

    
}
