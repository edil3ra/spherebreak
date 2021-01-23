import { Config } from '~/config'
import { GameConfig } from '~/models'
import { Board } from '~/scenes/games/board'
import { BoardPanelContainer } from '~/scenes/games/panels/boardContainerPanel'

export class TutorialScene extends Phaser.Scene {
    public background: Phaser.GameObjects.Image
    public board: Board
    public boardPanel: BoardPanelContainer

    constructor() {
        super({ key: Config.scenes.keys.tutorial })
    }

    init() {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
                this.board.setBoardContainerPosition()
                this.boardPanel.setPosition()
            },
            false
        )
        this.board = new Board(this)
        this.boardPanel = new BoardPanelContainer(this)
    }

    create(gameConfig: GameConfig) {
        this.setBackground()
        this.board.create()
        this.boardPanel.create()
        this.boardPanel.boardRigthPanel.setComboCountText(2,6)
        this.boardPanel.boardRigthPanel.setComboMultipleText(2,6)
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }
    

}
