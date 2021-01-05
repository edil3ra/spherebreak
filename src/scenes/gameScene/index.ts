import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'
import { CoinState, Difficulty, GameConfig, GameInfo } from '~/models'
import { Board } from '~/scenes/gameScene/board'
import { BoardGame } from './boardGame'
import { GameDataManager } from './gameDataManager'

function difficultyToGameInfo(difficulty: Difficulty): GameInfo {
    let gameInfo: GameInfo
    switch (difficulty) {
        case 'easy':
            gameInfo = {
                quota: 20,
                timer: 60,
                turn: 15,
            }
        case 'medium':
            gameInfo = {
                quota: 50,
                timer: 45,
                turn: 20,
            }
        case 'hard':
            gameInfo = {
                quota: 100,
                timer: 30,
                turn: 20,
            }
    }
    return gameInfo
}

export class GameScene extends Phaser.Scene {
    public data: GameDataManager
    public coinClickedIndex: number
    public entryClickedIndex: number
    public background: Phaser.GameObjects.Image
    public board: Board
    public boardGame: BoardGame
    public timerSyncCoin: Phaser.Time.TimerEvent
    public bordersStateChanged: Array<[CoinState, CoinGraphics]>

    constructor() {
        super({ key: Config.scenes.keys.game })
    }

    init(gameConfig: GameConfig) {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
                this.board.setBoardContainerPosition()
            },
            false
        )
        this.data = new GameDataManager(this)
        this.registerEvents()
        this.time.delayedCall(1, () => {
            this.initData(gameConfig)
        })
        this.board = new Board(this)
        this.boardGame = new BoardGame(this)
        this.bordersStateChanged = []
        this.initTimerSyncCoin()
    }

    initData(gameConfig: GameConfig) {
        const initialGameInfo = difficultyToGameInfo(gameConfig.difficulty)
        this.data.maxTimer = initialGameInfo.timer
        this.data.maxTurn = initialGameInfo.turn
        this.data.maxQuota = initialGameInfo.quota
        this.data.comboMultipleGoal = null
        this.data.comboCountGoal = null
        this.data.turn = 1
        this.data.sphere = this.data.pickNewRandomNumber()
        this.data.entries = [1, 2, 3, 4]
        this.data.borders = this.data.borders.map((_border) => this.data.pickNewRandomNumber())
    }

    registerEvents() {
        this.events.on('changedata-sphere', (_scene: GameScene, value: number) => {
            this.board.sphereGraphics.setText(value)
        })

        this.events.on('changedata-entries', (_scene: GameScene, entries: Array<number>) => {
            entries.forEach((entry: number, index: number) => {
                this.board.entriesGraphics[index].setText(entry)
            })
        })

        this.events.on('changedata-borders', (_scene: GameScene, borders: Array<number>) => {
            borders.forEach((border: number, index: number) => {
                this.board.bordersGraphics[index].setText(border)
            })
        })

        this.events.on('changedata-turn', (_scene: GameScene, value: number) => {
            this.boardGame.setTurnText(value)
        })

        this.events.on('changedata-timer', (_scene: GameScene, value: number) => {
            this.boardGame.setTimerText(value)
        })

        this.events.on('changedata-quota', (_scene: GameScene, value: number) => {
            this.boardGame.setQuotaText(value)
        })

        this.events.on('changedata-bordersActive', (_scene: GameScene, _borders: Array<boolean>) => {
            const activeChanged = this.data.bordersActiveIndexesChanged.map((index) => {
                if (this.data.bordersActive[index]) {
                    return ['active', this.board.bordersGraphics[index]]
                } else {
                    return ['inactive', this.board.bordersGraphics[index]]
                }
            })
            this.bordersStateChanged = [
                ...this.bordersStateChanged,
                ...(activeChanged as Array<[CoinState, CoinGraphics]>),
            ]
        })

        this.events.on('changedata-entriesActive', (_scene: GameScene, _borders: Array<boolean>) => {
            const activeChanged = this.data.entriesActiveIndexesChanged.map((index) => {
                if (this.data.entriesActive[index]) {
                    return ['active', this.board.entriesGraphics[index]]
                } else {
                    return ['inactive', this.board.entriesGraphics[index]]
                }
            })
            this.bordersStateChanged = [
                ...this.bordersStateChanged,
                ...(activeChanged as Array<[CoinState, CoinGraphics]>),
            ]
        })

        this.events.on('changedata-bordersAlive', (_scene: GameScene, _borders: Array<boolean>) => {
            // console.log(this.data.bordersAliveIndexesChanged)
            // console.log(this.data.bordersAlive)
            const deadChanged = this.data.bordersAliveIndexesChanged
                .filter((index) => {
                    return !this.data.bordersAlive[index]
                })
                .map((index) => {
                    return ['dead', this.board.bordersGraphics[index]]
                })
            this.data.bordersAliveIndexesChanged
                .filter((index) => {
                    return this.data.bordersAlive[index]
                })
                .forEach((index) => {
                    this.board.bordersGraphics[index].revive()
                })

            this.bordersStateChanged = [
                ...this.bordersStateChanged,
                ...(deadChanged as Array<[CoinState, CoinGraphics]>),
            ]
        })

        this.events.on('changedata-sphere', () => {
            this.board.sphereGraphics.revive()
        })
    }

    initTimerSyncCoin() {
        this.timerSyncCoin = this.time.addEvent({
            delay: 400,
            callback: () => {
                this.bordersStateChanged.forEach((coinStateChanged: [CoinState, CoinGraphics]) => {
                    const [state, coinGraphics] = coinStateChanged
                    coinGraphics.setState(state)
                })
                this.bordersStateChanged = []
            },
            loop: true,
        })
    }

    create(gameConfig: GameConfig) {
        this.setBackground()
        this.board.create()
        this.boardGame.create()
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    handleClickedCoin(index: number) {
        this.coinClickedIndex = index
        this.data.bordersActive = this.data.bordersActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.checkVictory()
    }

    handleClickedEntry(index: number) {
        this.entryClickedIndex = index
        this.data.entriesActive = this.data.entriesActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.checkVictory()
    }

    checkVictory() {
        if (this.data.isTurnWin()) {
            this.data.handleWinTurn()
        }
        if (this.data.isAllSphereActive()) {
            this.data.handleLoseTurn()
        }
    }
}
