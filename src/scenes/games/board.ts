import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'

export class Board {
    public scene: Phaser.Scene
    public coinsContainer: Phaser.GameObjects.Container
    public entriesContainer: Phaser.GameObjects.Container
    public container: Phaser.GameObjects.Container
    public sphereGraphics: CoinGraphics
    public bordersGraphics: Array<CoinGraphics>
    public entriesGraphics: Array<CoinGraphics>
    public background: Phaser.GameObjects.TileSprite
    public scoreTween: Phaser.Tweens.Tween
    public scoreText: Phaser.GameObjects.Text
    public comboCountTween: Phaser.Tweens.Tween
    public comboCountText: Phaser.GameObjects.Text
    public comboMultipleTween: Phaser.Tweens.Tween
    public comboMultipleText: Phaser.GameObjects.Text

    public handleClickedBorder: (index: number) => void
    public handleClickedEntry: (index: number) => void
    public isInteractive: boolean

    constructor(scene: Phaser.Scene, isInteractive: boolean = true) {
        this.scene = scene
        this.isInteractive = isInteractive
        this.handleClickedBorder = () => {}
        this.handleClickedEntry = () => {}
    }

    create() {
        this.setSphereGraphics()
        this.setCoinGraphicsAndContainer()
        this.setEntriesGraphicsAndContainer()
        this.setScore()
        this.setComboCount()
        this.setComboMultiple()
        this.setBoardContainer()
    }

    setScore() {
        this.scoreText = this.scene.add
            .text(
                Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5,
                Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5,
                '',
                Config.board.styles.score
            )
            .setOrigin(0.5, 0.5)
    }

    setComboCount() {
        this.comboCountText = this.scene.add
            .text(
                Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5,
                Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5,
                '',
                Config.board.styles.combo
            )
            .setOrigin(0.5, 0.5)
    }

    setComboMultiple() {
        this.comboMultipleText = this.scene.add
            .text(
                Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5,
                Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5,
                '',
                Config.board.styles.combo
            )
            .setOrigin(0.5, 0.5)
    }

    updateScore(score: number, xOffset = 0) {
        this.scoreText.setText(`+${score}`)
        this.scoreText.setAlpha(1)
        this.scoreText.x =
            Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5 + xOffset
        this.scoreText.y =
            Config.board.borderPadding +
            Config.board.borderSize -
            Config.board.score.offsetStartY +
            Config.board.entrySize * 0.5
        this.scoreTween = this.scene.tweens.add({
            targets: [this.scoreText],
            y: {
                from: this.scoreText.y,
                to: this.scoreText.y - Config.board.score.offsetY,
            },
            alpha: {
                from: Config.board.score.alpha.from,
                to: Config.board.score.alpha.to,
            },
            ease: Config.board.score.ease,
            duration: Config.board.score.duration,
            onComplete: () => {
                this.scoreText.setAlpha(0)
            },
        })
    }

    updateComboCount(count: number, xOffset = 0) {
        this.comboCountText.setText(`x${count}`)
        this.comboCountText.setAlpha(1)
        this.comboCountText.x =
            Config.board.borderPadding +
            Config.board.borderSize +
            Config.board.entrySize * 0.5 -
            Config.board.score.offsetX +
            xOffset
        this.comboCountText.y =
            Config.board.borderPadding +
            Config.board.borderSize -
            Config.board.score.offsetComboY -
            Config.board.score.offsetStartY +
            Config.board.entrySize * 0.5
        this.scoreTween = this.scene.tweens.add({
            targets: [this.comboCountText],
            y: {
                from: this.comboCountText.y,
                to: this.comboCountText.y - Config.board.score.offsetY - Config.board.score.offsetComboY,
            },
            alpha: {
                from: Config.board.score.alpha.from,
                to: Config.board.score.alpha.to,
            },
            ease: Config.board.score.ease,
            duration: Config.board.score.duration,
            onComplete: () => {
                this.comboCountText.setAlpha(0)
            },
        })
    }

    updateComboMultiple(multiple: number, xOffset = 0) {
        this.comboMultipleText.setText(`x${multiple}`)
        this.comboMultipleText.setAlpha(1)
        this.comboMultipleText.x =
            Config.board.borderPadding +
            Config.board.borderSize +
            Config.board.entrySize * 0.5 +
            Config.board.score.offsetX +
            xOffset
        this.comboMultipleText.y =
            Config.board.borderPadding +
            Config.board.borderSize -
            Config.board.score.offsetComboY -
            Config.board.score.offsetStartY +
            Config.board.entrySize * 0.5
        this.scoreTween = this.scene.tweens.add({
            targets: [this.comboMultipleText],
            y: {
                from: this.comboMultipleText.y,
                to: this.comboCountText.y - Config.board.score.offsetY - Config.board.score.offsetComboY,
            },
            alpha: {
                from: Config.board.score.alpha.from,
                to: Config.board.score.alpha.to,
            },
            ease: Config.board.score.ease,
            duration: Config.board.score.duration,
            onComplete: () => {
                this.comboMultipleText.setAlpha(0)
            },
        })
    }

    attachClickBorder(handleClickBorder: (index: number) => void): this {
        this.handleClickedBorder = handleClickBorder.bind(this.scene)
        return this
    }

    attachClickEntry(handleClickEntry: (index: number) => void): this {
        this.handleClickedEntry = handleClickEntry.bind(this.scene)
        return this
    }

    setSphereGraphics() {
        this.sphereGraphics = this.scene.add.coin(
            Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5 + 4,
            Config.board.borderPadding + Config.board.borderSize + Config.board.entrySize * 0.5 + 6,
            Config.board.sphereSize,
            Config.board.sphereSize,
            'sphere',
            Config.packer.name,
            Config.packer.coinSphere,
            0
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
        this.bordersGraphics = [...Array(12).keys()].map((index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX =
                positionX + directionX * (Config.board.borderSize + Config.board.borderPadding)
            const newPositionY =
                positionY + directionY * (Config.board.borderSize + Config.board.borderPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.board.borderSize,
                Config.board.borderSize,
                'border',
                Config.packer.name,
                Config.packer.coinBorder,
                0
            ) as CoinGraphics
            if (this.isInteractive) {
                coin.background
                    .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                    .on(
                        Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                        () => this.handleClickedBorder(index),
                        this
                    )
            }
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
        this.entriesGraphics = [...Array(4).keys()].map((index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX = positionX + directionX * (Config.board.entrySize + Config.board.entryPadding)
            const newPositionY = positionY + directionY * (Config.board.entrySize + Config.board.entryPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.board.entrySize,
                Config.board.entrySize,
                'entry',
                Config.packer.name,
                Config.packer.coinEntry,
                0
            ) as CoinGraphics
            if (this.isInteractive) {
                coin.background
                    .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                    .on(
                        Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                        () => this.handleClickedEntry(index),
                        this
                    )
            }
            return coin
        })
        this.entriesContainer = this.scene.add
            .container(0, 0, this.entriesGraphics)
            .setPosition(
                Config.board.entrySize + Config.board.entryPadding,
                Config.board.entrySize + Config.board.entryPadding
            )
    }

    setBoardContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.coinsContainer,
            this.entriesContainer,
            this.sphereGraphics,
            this.scoreText,
            this.comboCountText,
            this.comboMultipleText,
        ])
        this.setPosition()
    }

    setPosition() {
        this.container.setPosition(
            Config.board.borderSize / 2,
            Config.board.borderSize / 2 + Config.panels.board.height + 10
        )
    }

    resetTweening() {
        this.entriesGraphics.forEach((coin: CoinGraphics) => {
            if (coin.tweenFlipping.isPlaying()) {
                coin.tweenFlipping.stop(0)
            }
        })
        this.bordersGraphics.forEach((coin: CoinGraphics) => {
            if (coin.tweenFlipping.isPlaying()) {
                coin.tweenFlipping.stop(0)
            }
        })
    }
}
