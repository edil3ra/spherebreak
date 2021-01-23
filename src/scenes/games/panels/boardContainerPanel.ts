import { BoardLeftPanel } from '~/scenes/games/panels/boardLeftPanel'
import { BoardRightPanel } from '~/scenes/games/panels/boardRightPanel'
import { BoardMiddlePanel } from '~/scenes/games/panels/boardMiddlePanel'
import { Config } from '~/config'

export class BoardPanelContainer {
    public scene: Phaser.Scene
    public background: Phaser.GameObjects.Image
    public boardLeftPanel: BoardLeftPanel
    public boardRigthPanel: BoardRightPanel
    public boardMiddlePanel: BoardMiddlePanel
    public container: Phaser.GameObjects.Container

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.boardLeftPanel = new BoardLeftPanel(scene)
        this.boardMiddlePanel = new BoardMiddlePanel(scene)
        this.boardRigthPanel = new BoardRightPanel(scene)
    }

    public create() {
        this.initBackground()
        this.boardLeftPanel.create()
        this.boardLeftPanel.container.setPosition(
            Config.scenes.game.boardPanel.leftPadding,
            Config.scenes.game.boardPanel.topPadding,
        )
        
        this.boardMiddlePanel.create()
        this.boardMiddlePanel.container.setPosition(
            Config.scenes.game.boardPanel.leftPadding + Config.scenes.game.boardPanel.middlePanelOffsetX,
            Config.scenes.game.boardPanel.topPadding - 4,
        )
        
        this.boardRigthPanel.create()
        this.boardRigthPanel.container.setPosition(
            Config.scenes.game.boardPanel.leftPadding + Config.scenes.game.boardPanel.rightPanelOffsetX,
            Config.scenes.game.boardPanel.topPadding,
        )
        
        this.container = this.scene.add.container(0, 0, [
            this.background,
            this.boardLeftPanel.container,
            this.boardMiddlePanel.container,
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
