import { GameScene } from "~/scenes/gameScene/gameScene"
import { BoardLeftPanel } from "~/scenes/gameScene/boardLeftPanel"
import { BoardRightPanel } from "~/scenes/gameScene//boardRightPanel"
import { Config } from '~/config'

const TOP_PADDING = 40
const LEFT_PADDING = 40

export class BoardPanel {
    public scene: GameScene
    public background: Phaser.GameObjects.Image
    public boardLeftPanel: BoardLeftPanel
    public boardRigthPanel: BoardRightPanel
    public container: Phaser.GameObjects.Container

    constructor(scene: GameScene) {
        this.scene = scene
        this.boardLeftPanel = new BoardLeftPanel(scene)
        this.boardRigthPanel = new BoardRightPanel(scene)
    }

    public create() {
        this.initBackground()
        this.boardLeftPanel.create()
        this.boardLeftPanel.container.setPosition(LEFT_PADDING, TOP_PADDING)
        this.boardRigthPanel.create()
        this.boardRigthPanel.container.setPosition(LEFT_PADDING + 200, TOP_PADDING)
        this.container = this.scene.add.container(0, 0, [
            this.background,
            this.boardLeftPanel.container,
            this.boardRigthPanel.container,
        ])
    }

    initBackground() {
        this.background = this.scene.add.image(0, 0, 'banner' )
            .setOrigin(0, 0)
            .setSize(Config.scenes.game.boardWidth, 100)
            .setDisplaySize(Config.scenes.game.boardWidth, 100)

    }
    
}
