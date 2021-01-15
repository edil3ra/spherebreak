import { Config } from "~/config"
import { GameScene } from "~/scenes/gameScene"


const OFFSET_ITEM = 20

export class BoardLeftPanel {
    public scene: GameScene
    public container: Phaser.GameObjects.Container
    public turnText: Phaser.GameObjects.Text
    public timerText: Phaser.GameObjects.Text
    public quotaText: Phaser.GameObjects.Text
    

    constructor(scene: GameScene) {
        this.scene = scene
    }

    public create() {
        this.initTurnText()
        this.initTimerText()
        this.initQuotaText()
        this.initContainer()
    }


    initTurnText() {
        this.turnText = this.scene.add.text(0, 0, '')
            .setPosition(0)
            .setStyle(Config.scenes.game.boardPanel.textConfig)
        this.setTurnText(0)
    }

    initTimerText() {
        this.timerText = this.scene.add.text(0, 0, '')
            .setPosition(0, OFFSET_ITEM * 2)
            .setStyle(Config.scenes.game.boardPanel.textConfig)
        this.setTimerText(this.scene.data.maxTimer)
    }

    initQuotaText() {
        this.quotaText = this.scene.add.text(0, 0, '')
            .setPosition(0, OFFSET_ITEM)
            .setStyle(Config.scenes.game.boardPanel.textConfig)
        this.setQuotaText(0)
    }


    setTurnText(turn: number) {
        this.turnText.setText(`Turn         ${turn}/${this.scene.data.maxTurn}`)
    }

    setTimerText(timer: number) {
        this.timerText.setText(`Time        ${timer}`)
    }

    setQuotaText(quota: number) {
        this.quotaText.setText(`Quota      ${quota}/${this.scene.data.maxQuota}`)
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.turnText,
            this.timerText,
            this.quotaText,
        ])
    }

    
}
