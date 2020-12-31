import { Config } from "~/config"
import { GameScene } from "~/scenes/gameScene"


const textConfigStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '14px',
    color: 'white',
    fontStyle: 'bold',
}

const TOP_PADDING = 40
const LEFT_PADDING = 40
const OFFSET_ITEM = 20

export class BoardGame {
  public scene: GameScene
    public background: Phaser.GameObjects.Image
    public boardGameContainer: Phaser.GameObjects.Container
    public turnText: Phaser.GameObjects.Text
    public timerText: Phaser.GameObjects.Text
    public quotaText: Phaser.GameObjects.Text

    constructor(scene: GameScene) {
        this.scene = scene
    }

    public create() {
        this.setBackground()
        this.setTurnText()
        this.setTimerText()
        this.setQuotaText()
    }

    setBackground() {
        this.background = this.scene.add.image(0, 0, 'boardBackground' )
            .setOrigin(0, 0)
            .setSize(180, 140)
            .setDisplaySize(180, 140)
    }

    setTurnText() {
        this.turnText = this.scene.add.text(0, 0, "Turn         6/15")
            .setPosition(LEFT_PADDING, TOP_PADDING)
            .setStyle(textConfigStyle)
    }

    setTimerText() {
        this.timerText = this.scene.add.text(0, 0, "Time        0:58")
            .setPosition(LEFT_PADDING, TOP_PADDING + OFFSET_ITEM)
            .setStyle(textConfigStyle)
    }

    setQuotaText() {
        this.quotaText = this.scene.add.text(0, 0, "Quota      6/20")
            .setPosition(LEFT_PADDING, TOP_PADDING + OFFSET_ITEM * 2)
            .setStyle(textConfigStyle)
    }

    setBoardContainer() {
        this.boardGameContainer = this.scene.add.container(0, 0, [
            this.background,
            this.turnText,
            this.timerText,
            this.quotaText,
        ])
        this.setBoardContainerPosition()
    }

  setBoardContainerPosition() {
        this.boardGameContainer.setPosition(
            0, 0
        )
    }
    
}
