import { Config } from '~/config'
import { Coin } from '~/entities/Coin'
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
    public coinsStateChanged: Array<[CoinState, Coin]>
    
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

        this.initData(gameConfig)
        this.board = new Board(this)
        this.boardGame = new BoardGame(this)
        this.coinsStateChanged = []
        this.registerEvents()

        this.timerSyncCoin = this.time.addEvent({delay: 400, callback: () => {
            this.coinsStateChanged.forEach((coinStateChanged: [CoinState, Coin]) => {
                const [state, coinGraphics] = coinStateChanged
                coinGraphics.setState(state)
            })
            this.coinsStateChanged = []
        }, loop: true})
    }

    initData(gameConfig: GameConfig) {
        this.data = new GameDataManager(this)
        const initialGameInfo = difficultyToGameInfo(gameConfig.difficulty)
        this.data.maxTimer = initialGameInfo.timer
        this.data.maxTurn = initialGameInfo.turn
        this.data.maxQuota = initialGameInfo.quota
        this.data.comboMultipleGoal = null
        this.data.comboCountGoal = null
        this.data.entries = [1, 2, 3, 4]
        this.data.sphere = this.data.pickNewRandomNumber()
        this.data.setCoinsAfterTurn()
    }

    registerEvents() {
        this.events.on('changedata-sphere', (_scene: GameScene, value: number) => {
            this.board.sphereGraphics.setText(value)
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

        this.events.on('changedata-coinsActive', (_scene: GameScene, _coins: Array<number>) => {
            this.coinsStateChanged.push([
                'active',
                this.board.coinsGraphics[this.coinClickedIndex]
            ])
        })
        
        this.events.on('changedata-entriesActive', (_scene: GameScene, _coins: Array<number>) => {
            this.coinsStateChanged.push([
                'active',
                this.board.entriesGraphics[this.entryClickedIndex]
            ])
        })
    }

    create() {
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
        this.data.coinsActive[index] = true
        this.coinClickedIndex = index
        this.data.coinsActive = this.data.coinsActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.checkVictory()
    }

    handleClickedEntry(index: number) {
        this.data.entriesActive[index] = true
        this.entryClickedIndex = index
        this.data.entriesActive = this.data.entriesActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.checkVictory()
    }

    checkVictory() {
        if (this.data.isWinTurn()) {
            this.data.handleWinTurn()
        }
        if (this.data.isAllSphereActive()) {
            this.data.handleLoseTurn()
        }
    }
}
