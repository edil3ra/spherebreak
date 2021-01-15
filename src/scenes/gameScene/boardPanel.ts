import { GameScene } from '~/scenes/gameScene/gameScene'
import { BoardLeftPanel } from '~/scenes/gameScene/boardLeftPanel'
import { BoardRightPanel } from '~/scenes/gameScene//boardRightPanel'
import { Config } from '~/config'

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
        this.boardLeftPanel.container.setPosition(
            Config.scenes.game.boardPanel.leftPadding,
            Config.scenes.game.boardPanel.topPadding,
        )
        this.boardRigthPanel.create()
        this.boardRigthPanel.container.setPosition(
            Config.scenes.game.boardPanel.leftPadding + Config.scenes.game.boardPanel.rightPanelOffsetX,
            Config.scenes.game.boardPanel.topPadding,
        )
        this.container = this.scene.add.container(0, 0, [
            this.background,
            this.boardLeftPanel.container,
            this.boardRigthPanel.container,
        ])
        this.setPosition()
    }

    initBackground() {
        this.background = this.scene.add
            .image(0, 0, Config.packer.name, Config.packer.bannerModern)
            .setOrigin(0, 0)
            .setSize(Config.scenes.game.boardPanel.width, Config.scenes.game.boardPanel.height)
            .setDisplaySize(Config.scenes.game.boardPanel.width, Config.scenes.game.boardPanel.height)
    }


    setPosition() {
        this.container.setPosition(
            this.scene.scale.width / 2 -
                Config.scenes.game.boardPanel.width / 2,
            this.scene.scale.height / 2 -
                Config.scenes.game.board.height / 2 -
                Config.scenes.game.boardPanel.height - 20,
        )
    }
}
