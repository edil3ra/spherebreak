import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'
import { GameScene } from '~/scenes/gameScene'

export class Board {
    public scene: GameScene
    public coinsContainer: Phaser.GameObjects.Container
    public entriesContainer: Phaser.GameObjects.Container
    public boardContainer: Phaser.GameObjects.Container
    public sphereGraphics: CoinGraphics
    public bordersGraphics: Array<CoinGraphics>
    public entriesGraphics: Array<CoinGraphics>

    constructor(scene: GameScene) {
        this.scene = scene
    }

    public create() {
        this.setSphereGraphics()
        this.setCoinGraphicsAndContainer()
        this.setEntriesGraphicsAndContainer()
        this.setBoardContainer()
    }

    setSphereGraphics() {
        this.sphereGraphics = this.scene.add.coin(
            Config.scenes.game.board.borderPadding +
                Config.scenes.game.board.borderSize +
                Config.scenes.game.board.entrySize * 0.5 +
                4,
            Config.scenes.game.board.borderPadding +
                Config.scenes.game.board.borderSize +
                Config.scenes.game.board.entrySize * 0.5 +
                6,
            Config.scenes.game.board.sphereSize,
            Config.scenes.game.board.sphereSize,
            'sphere',
            this.scene.data.sphere
        )
    }

    setCoinGraphicsAndContainer() {
        const directions = [
            [0, 0],
            [1, 0],
            [1, 0],
            [1, 0],
            [0, 1],
            [0, 1],
            [0, 1],
            [-1, 0],
            [-1, 0],
            [-1, 0],
            [0, -1],
            [0, -1],
        ]

        let currentPosition = [0, 0]
        this.bordersGraphics = this.scene.data.borders.map((numero: number, index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX =
                positionX +
                directionX * (Config.scenes.game.board.borderSize + Config.scenes.game.board.borderPadding)
            const newPositionY =
                positionY +
                directionY * (Config.scenes.game.board.borderSize + Config.scenes.game.board.borderPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.scenes.game.board.borderSize,
                Config.scenes.game.board.borderSize,
                'border',
                numero
            ) as CoinGraphics
            coin.background
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(
                    Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                    () => this.scene.handleClickedBorder(index),
                    this
                )
            return coin
        })
        this.coinsContainer = this.scene.add.container(0, 0, this.bordersGraphics)
    }

    setEntriesGraphicsAndContainer() {
        const directions = [
            [0, 0],
            [1, 0],
            [0, 1],
            [-1, 0],
        ]

        let currentPosition = [0, 0]

        this.entriesGraphics = this.scene.data.entries.map((numero: number, index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX =
                positionX +
                directionX * (Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding)
            const newPositionY =
                positionY +
                directionY * (Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.scenes.game.board.entrySize,
                Config.scenes.game.board.entrySize,
                'entry',
                numero
            ) as CoinGraphics
            coin.background
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(
                    Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                    () => this.scene.handleClickedEntry(index),
                    this
                )

            return coin
        })
        this.entriesContainer = this.scene.add
            .container(0, 0, this.entriesGraphics)
            .setPosition(
                Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding,
                Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding
            )
    }

    setBoardContainer() {
        this.boardContainer = this.scene.add.container(0, 0, [
            this.coinsContainer,
            this.entriesContainer,
            this.sphereGraphics,
        ])
        this.setBoardContainerPosition()
    }

    setBoardContainerPosition() {
        this.boardContainer.setPosition(
            this.scene.scale.width / 2 -
                Config.scenes.game.board.width / 2 +
                Config.scenes.game.board.borderSize / 2,
            this.scene.scale.height / 2 -
                Config.scenes.game.board.height / 2 +
                Config.scenes.game.board.borderSize / 2
        )
    }
}
