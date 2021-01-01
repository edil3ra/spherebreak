import { Config } from '~/config'
import { Difficulty, GameConfig, GameInfo } from '~/models'
import { Board } from '~/scenes/gameScene/board'
import { BoardGame } from './boardGame'

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

class GameDataManager extends Phaser.Data.DataManager {
    constructor(scene: GameScene) {
        super(scene)

        this.set('turn', 0)
        this.set('timer', 0)
        this.set('quota', 0)
        this.set('comboMultiple', 0)
        this.set('comboCount', 0)
        this.set('sphere', 0)
    }
    
    public get turn(): number {
        return this.get('turn') as number
    }

    public get timer(): number {
        return this.get('turn') as number
    }

    public get quota(): number {
        return this.get('turn') as number
    }

    public get comboCount(): number {
        return this.get('turn') as number
    }

    public get sphere(): number {
        return this.get('turn') as number
    }

    public set turn(value: number) {
        this.set('turn', value)
    }

    public set timer(value: number) {
        this.set('timer', value)
    }

    public set quota(value: number) {
        this.set('quota', value)
    }

    public set comboMultiple(value: number) {
        this.set('comboMultiple', value)
    }

    public set comboCount(value: number) {
        this.set('comboCount', value)
    }

    public set sphere(value: number) {
        this.set('sphere', value)
    }

    
}


export class GameScene extends Phaser.Scene {
    public maxTurn: number
    public maxTimer: number
    public maxQuota: number
    public comboMultipleGoal: number | null 
    public comboCountGoal: number | null
    public coins: Array<number> = new Array(12).fill(0)
    public coinsAlive: Array<boolean> = new Array(12).fill(true)
    public coinsActive: Array<boolean> = new Array(12).fill(false)
    public entries: Array<number> = new Array(4).fill(0)
    public entriesActive: Array<boolean> = new Array(4).fill(false)
    public sphere: number
    public ratioCreateCoins = 1
    public background: Phaser.GameObjects.Image
    public board: Board
    public boardGame: BoardGame
    public data: GameDataManager


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
        

        
        const initialGameInfo = difficultyToGameInfo(gameConfig.difficulty)
        this.maxTimer = initialGameInfo.timer
        this.maxTurn = initialGameInfo.turn
        this.maxQuota = initialGameInfo.quota
        this.comboMultipleGoal = null
        this.comboCountGoal = null
        

        this.board = new Board(this)
        this.boardGame = new BoardGame(this)
        this.setEntries()
        this.setCoinsAfterTurn()

    }

    create() {
        this.setBackground()
        this.board.create()
        this.boardGame.create()
        this.data.set('sphere', this.pickNewRandomNumber())

    }

    setBackground() {
        this.background = this.add
            .image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    setEntries() {
        this.entries = [1, 2, 3, 4]
    }

    setCoinsAfterTurn() {
        this.coins = this.coins.map(() => {
            if (this.ratioCreateCoins >= Math.random()) {
                return Phaser.Math.RND.integerInRange(1, 9)
            } else {
                return 0
            }
        })
        this.ratioCreateCoins = Phaser.Math.RND.integerInRange(2, 10) / 10
    }

    pickNewRandomNumber() {
        return Phaser.Math.RND.integerInRange(1, 9)
    }

    handleClickedCoin(index: number) {
        this.coinsActive[index] = true
        this.handleClicked()
    }

    handleClickedEntry(index: number) {
        this.entriesActive[index] = true
        this.handleClicked()
    }

    handleClicked() {
        if (this.isWinTurn()) {
            this.handleWinTurn()
        }
        if (this.isAllSphereActive()) {
            this.handleLoseTurn()
        }
        console.log(this.displayCombo())
    }

    get total(): number {
        const activeCoins = this.coins.filter((_coin: number, index: number) => this.coinsActive[index])
        const activeEntries = this.entries.filter((_coin: number, index: number) => this.entriesActive[index])

        return (
            activeCoins.reduce((previous: number, current: number) => previous + current, 0) +
            activeEntries.reduce((previous: number, current: number) => previous + current, 0)
        )
    }

    get comboCountCurrent(): number {
        const activeCoins = this.coins.filter((_coin: number, index: number) => this.coinsActive[index])
        const activeEntries = this.entries.filter((_coin: number, index: number) => this.entriesActive[index])
        return activeCoins.length + activeEntries.length
    }

    get comboMultipleCurrent(): number {
        return Math.floor(this.total / this.sphere)
    }

    getCombo(comboKey: string): number {
        const combo =  this.data.get(comboKey)
        if(combo === 0) {
            return 0
        } else {
            return Math.pow(2, combo - 1) 
        }
    }


    get point(): number {
        return 1 + this.getCombo('comboCount') + this.getCombo('comboMultiple')
    }

    isWinTurn() {
        return this.total % this.sphere === 0
    }

    isAllSphereActive() {
        const hasNoCoins = this.coinsActive.every((coinActive) => coinActive)
        const hasNoEntries = this.entriesActive.every((entryActive) => entryActive)
        return hasNoCoins && hasNoEntries
    }

    handleWinTurn() {
        if(this.comboMultipleGoal === null) {
            this.comboMultipleGoal = this.comboMultipleCurrent
        } else {
            if(this.comboMultipleGoal === this.comboMultipleCurrent) {
                this.data.comboMultiple = this.data.comboMultiple + 1
            }else {
                this.comboMultipleGoal = null
                this.data.comboMultiple = 0
            }
        }

        if(this.comboCountGoal === null) {
            this.comboCountGoal = this.comboCountCurrent
        } else {
            if(this.comboCountGoal === this.comboCountCurrent) {
                this.data.comboMultiple = this.data.comboMultiple + 1
            }else {
                this.comboCountGoal = null
                this.data.comboMultiple = 0
            }
        }
        this.data.quota = this.data.quota + this.point
        this.finishTurn()
    }

    handleLoseTurn() {
        this.comboMultipleGoal = null
        this.comboCountGoal = null
        this.data.comboMultiple = 0
        this.data.comboCount = 0
        this.finishTurn()
    }

    finishTurn() {
        this.data.turn = this.data.turn + 1
        this.data.sphere = this.pickNewRandomNumber()
    }

    displayCombo() {
        return({
            comboMultipleGoal: this.comboMultipleGoal,
            comboCountGoal: this.comboCountGoal,
            comboMultipleCurrent: this.comboMultipleCurrent,
            comboCountCurrent: this.comboCountCurrent,
            point: this.point,
        })
    }
}
