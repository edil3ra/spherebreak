import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'
import { MyGame } from '~/game'
import { CoinState, TutorialState } from '~/models'
import { Board } from '~/scenes/games/board'
import { BoardPanelContainer } from '~/scenes/games/panels/boardContainerPanel'
import { TutorialHelperPanel } from '~/scenes/games/panels/tutorialHelperPanel'
import { TutorialStartEndScene } from './tutorialStartEndScene'

type Turn = {
    pointers: Array<{ x: number; y: number }>
    text: string
    sphere: number
    entries: Array<number>
    borders: Array<number>
    entriesActive: Array<number>
    bordersActive: Array<number>
    bordersDead: Array<number>
    entriesLigthing: Array<number>
    bordersLigthing: Array<number>
    timer: number
    turn: number
    score: number
    maxScore: number
    maxTurn: number
    comboCount: number
    comboMultiple: number
    comboCountGoal: number | null
    comboMultipleGoal: number | null
    endTurn: boolean
}

export class TutorialScene extends Phaser.Scene {
    public game: MyGame
    public tutorialState: TutorialState
    public tutorialStartEndScene: TutorialStartEndScene
    public background: Phaser.GameObjects.Image
    public pointersImage: Array<Phaser.GameObjects.Image>
    public boardPanel: BoardPanelContainer
    public tutorialHelperPanel: TutorialHelperPanel
    public board: Board
    public turns: Array<Turn>
    public turnsTemplate: Array<Partial<Turn>>
    public currentTurn: Turn
    public currentTurnIndex: number
    public timerSyncCoin: Phaser.Time.TimerEvent
    public coinsStateChanged: Array<[CoinState, CoinGraphics]>
    public tweenCursor: Phaser.Tweens.Tween
    public container: Phaser.GameObjects.Container

    constructor() {
        super({ key: Config.scenes.keys.tutorial })
    }

    init() {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
                this.board.setPosition()
                this.boardPanel.setPosition()
                this.tutorialHelperPanel.setPosition()
            },
            false
        )
        this.tutorialStartEndScene = this.scene.get(
            Config.scenes.keys.tutorialStartEnd
        ) as TutorialStartEndScene
        this.board = new Board(this, false)
        this.boardPanel = new BoardPanelContainer(this)
        this.tutorialHelperPanel = new TutorialHelperPanel(this)
        this.currentTurn = this.defaultTurn()
        this.currentTurnIndex = 0

        this.scene.launch(Config.scenes.keys.tutorialStartEnd)
        this.scene.sleep(Config.scenes.keys.tutorialStartEnd)
        this.events.on('resume', () => {
            this.tweens.add({
                ...Config.scenes.game.tweens.camera.in,
                targets: this.cameras.main,
                callbackScope: this,
                onComplete: () => {
                    this.nextTurnOrShowText()
                },
            })
        })
    }

    create() {
        this.setBackground()
        this.board.create()
        this.boardPanel.create()
        this.pointersImage = []
        for (let i = 0; i < 12; i++) {
            this.pointersImage.push(
                this.add.image(0, 0, Config.packer.name, Config.packer.hand).setVisible(false)
            )
        }
        this.boardPanel.boardRigthPanel.setComboCountText(0, 0)
        this.boardPanel.boardRigthPanel.setComboMultipleText(0, 0)
        this.container = this.add.container(0, 0, [
            this.board.container,
            this.boardPanel.container,
            ...this.pointersImage,
        ])
        this.setPositionContainer()
        this.turnsTemplate = this.buildTurnsTemplate()
        this.turns = this.buildTurns()
        this.coinsStateChanged = []
        this.initTimerSyncCoin()

        this.cameras.main.fadeIn(200, 0, 0, 0, (_camera: any, percentage: number) => {
            if (percentage >= 1) {
                this.tutorialStartEndScene.state = 'start'
                this.tutorialStartEndScene.setText(`
Welcome to Spherebreak!
Tap to enter tutorial
`)
                this.switchTutorial()
            }
        })
    }

    attachTweenCursor() {
        if (this.tweenCursor) {
            this.tweenCursor.stop()
        }
        this.tweenCursor = this.tweens.add({
            targets: this.pointersImage,
            x: '-=10',
            ease: 'Sine.easeInOut',
            duration: 400,
            repeat: -1,
            yoyo: true,
        })
    }

    defaultTurn(): Turn {
        return {
            pointers: [],
            text: '',
            sphere: 4,
            entries: [1, 2, 3, 4],
            borders: [8, 2, 9, 3, 7, 8, 2, 3, 1, 2, 4, 5],
            entriesActive: Array(4).fill(0),
            bordersActive: Array(12).fill(0),
            bordersDead: Array(12).fill(0),
            entriesLigthing: Array(12).fill(0),
            bordersLigthing: Array(12).fill(0),
            timer: 30,
            turn: 1,
            score: 0,
            maxScore: 10,
            maxTurn: 10,
            comboCount: 0,
            comboMultiple: 0,
            comboCountGoal: 0,
            comboMultipleGoal: 0,
            endTurn: false,
        }
    }

    buildTurnsTemplate(): Array<Partial<Turn>> {
        return [
            {
                entriesLigthing: [0, 1, 0, 0],
            },
            {
                text: `
You clicked on an entry coin
Entry coin reapear after each turn
They don't increase the score
Used it as the main way to make combo
`,
            },
            {
                entriesActive: [0, 1, 0, 0],
                bordersLigthing: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                score: 0,
            },
            {
                text: `
You clicked on a border coin
They dissappear after you use it
They reapear after 4 turn
They increase the score by one
Use it to make more point`,
            },
            {
                entriesActive:   [0, 1, 0, 0],
                bordersActive:   [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                bordersLigthing: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                endTurn: true,
                score: 1,
            },
            {
                text: `
You score two points
your combo count is 3
your combo multiple is 2 
You have 10 turns to win the game
Reach the max score before all turn end
`
            },
            {
                text: `
You make count combo by using the same 
amount of coins than the previous turn.
`,
            },
            {
                bordersLigthing: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                bordersDead:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
            },
            {
                bordersLigthing: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                bordersActive:   [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                bordersDead:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
            },
            {
                entriesLigthing: [0, 1, 0, 0],
                bordersActive:   [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                bordersDead:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
                endTurn: true,
            },
            {
                text: `
You used 3 coins this turn
You target count combo target is 3
You total count combo is 1
`,
            },
            {
                sphere: 5,
                bordersLigthing: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                bordersDead:     [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
            },
            {
                sphere: 5,
                bordersLigthing: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                bordersActive:   [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                bordersDead:     [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
            },
            {
                sphere: 5,
                entriesLigthing: [0, 0, 1, 0],
                bordersActive:   [0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                bordersDead:     [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
                endTurn: true,
            },
            {
                text: `
You used 3 coins this turn
You target count combo target is 3
You total count combo is 2
`,
            },
            {
                text: `
You make multiple combo by using a multiple 
of the middle sphere.
`,
            },
            {
                sphere: 3,
                entriesLigthing: [0, 0, 0, 1],
                bordersDead:     [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
            },
            {
                sphere: 3,
                entriesActive:   [0, 0, 0, 1],
                bordersLigthing:  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                bordersDead:     [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1],
                score: 2,
                turn: 2,
                comboCount: 1,
                comboMultiple: 1,
                comboCountGoal: 3,
                comboMultipleGoal: 2,
                endTurn: true,
            },
        ]

        
        
    }

    
    buildTurns(): Array<Turn> {
        return this.turnsTemplate.map((turn) => {
            return { ...this.defaultTurn(), ...turn }
        })
    }

    nextTurnOrShowText() {
        if (this.currentTurnIndex === this.turns.length) {
            this.tutorialStartEndScene.state = 'end'
            this.tutorialStartEndScene.setText(`Tap to end tutorial`)
            this.switchTutorial()
            return
        }
        if (this.turns[this.currentTurnIndex].text === '') {
            this.nextTurn(this.currentTurnIndex)
        } else {
            this.tutorialStartEndScene.setText(this.turns[this.currentTurnIndex].text)
            this.switchTutorial()
        }
        this.currentTurnIndex += 1

    }

    nextTurn(index: number) {
        this.cameras.main.fadeIn(200, 0, 0, 0)
        if (this.currentTurnIndex > 0) {
            this.game.playSound('switch')
        }
        this.pointersImage.forEach((pointerImage) => {
            pointerImage.setVisible(false)
        })
        const currentTurn = Object.assign({}, this.defaultTurn(), this.turns[index])
        currentTurn.pointers.forEach((pointer: { x: number; y: number }, index: number) => {
            this.pointersImage[index].setPosition(pointer.x, pointer.y).setVisible(true)
        })
        this.attachTweenCursor()

        this.board.sphereGraphics.setText(currentTurn.sphere)
        this.nextTurnUpdateEntries(currentTurn)
        this.nextTurnUpdateBorders(currentTurn)
        
        this.boardPanel.boardLeftPanel.setTurnText(currentTurn.turn, currentTurn.maxTurn)
        this.boardPanel.boardMiddlePanel.setTimerText(currentTurn.timer)
        this.boardPanel.boardLeftPanel.setQuotaText(currentTurn.score, currentTurn.maxScore)
        this.boardPanel.boardRigthPanel.setComboCountText(
            currentTurn.comboCount,
            currentTurn.comboMultipleGoal
        )
        this.boardPanel.boardRigthPanel.setComboMultipleText(
            currentTurn.comboMultiple,
            currentTurn.comboMultipleGoal
        )
    }


    nextTurnUpdateEntries(turn: Turn) {
        turn.entries.forEach((value: number, index: number) => {
            this.board.entriesGraphics[index].setText(value)
            if (turn.entriesLigthing[index] === 1) {
                this.board.entriesGraphics[index].background
                    .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                        this.board.entriesGraphics[index].background.off(
                            Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN
                        )
                        // this.board.entriesGraphics[index].setState('light')

                        if (turn.endTurn) {
                            this.displayScore(turn)
                            this.time.delayedCall(100, () => {
                                this.board.entriesGraphics[index].setState('delight')
                            })
                            
                            this.time.delayedCall(1000, () => {
                                this.nextTurnOrShowText()
                            })
                        } else {
                            this.time.delayedCall(100, () => {
                                this.board.entriesGraphics[index].setState('delight')
                                this.nextTurnOrShowText()                            
                            })
                        }
                    })
                this.board.entriesGraphics[index].setState('light')
            }
            if (turn.entriesActive[index] === 1) {
                this.coinsStateChanged.push(['active', this.board.entriesGraphics[index]])
            } else {
                this.coinsStateChanged.push(['inactive', this.board.entriesGraphics[index]])
            }
        })
    }
    
    
    nextTurnUpdateBorders(turn: Turn) {
        turn.borders.forEach((border: number, index: number) => {
            this.board.bordersGraphics[index].setText(border)
            if (turn.bordersLigthing[index] === 1) {
                this.board.bordersGraphics[index].setState('light')
                this.board.bordersGraphics[index].background
                    .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                    .once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                        this.board.bordersGraphics[index].background.off(
                            Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN
                        )
                        if (turn.endTurn) {
                            this.displayScore(turn)
                            this.time.delayedCall(1000, () => {
                                this.nextTurnOrShowText()
                            })
                        } else {
                            this.nextTurnOrShowText()                            
                        }
                    })
            }
            if (turn.bordersDead[index] === 1 && this.board.bordersGraphics[index].state !== 'dead') {
                this.board.bordersGraphics[index].setState('dead')
            }
            
            else if (turn.bordersActive[index] === 1) {
                this.coinsStateChanged.push(['active', this.board.bordersGraphics[index]])
            }
        })
    }

    initTimerSyncCoin() {
        if (this.timerSyncCoin) {
            this.timerSyncCoin.destroy()
            this.board.resetTweening()
        }
        this.timerSyncCoin = this.time.addEvent({
            delay: Config.scenes.game.coinAnimationTimer * 2,
            callback: () => {
                this.coinsStateChanged.forEach((coinStateChanged: [CoinState, CoinGraphics]) => {
                    const [state, coinGraphics] = coinStateChanged
                    coinGraphics.setState(state)                        
                });``
                this.coinsStateChanged = []
            },
            loop: true,
        })
    }
    

    switchTutorial() {
        this.tweens.add({
            ...Config.scenes.game.tweens.camera.out,
            targets: this.cameras.main,
            onComplete: () => {
                this.scene.pause(Config.scenes.keys.tutorial)
                this.scene.wake(Config.scenes.keys.tutorialStartEnd)
                this.scene.bringToTop(Config.scenes.keys.tutorialStartEnd)
            },
        })
    }

    displayScore(turn: Turn) {
        const randomNumber = Phaser.Math.Between(-20, 20)
        this.board.updateScore(turn.score, randomNumber)
        this.board.updateComboCount(turn.comboCount, randomNumber)
        this.board.updateComboMultiple(turn.comboMultiple, randomNumber)
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    setPositionContainer() {
        this.container.setPosition(
            this.scale.width / 2 - Config.board.width / 2,
            this.scale.height / 2 - (Config.board.height + Config.panels.board.height + 10) / 2
        )
    }
}
