import { Config } from '~/config'
import { MyGame } from '~/game'
import { TutorialState } from '~/models'
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
    entriesActive: Array<boolean>
    bordersActive: Array<boolean>
    bordersAlive: Array<boolean>
    entriesLigthing: Array<boolean>
    bordersLigthing: Array<boolean>
    timer: number
    turn: number
    score: number
    maxScore: number
    maxTurn: number
    comboCount: number
    comboMultiple: number
    comboCountGoal: number | null
    comboMultipleGoal: number | null
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
            })
        })
    }

    create() {
        this.setBackground()
        this.board.create()
        this.boardPanel.create()
        // this.tutorialHelperPanel.create()
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
            // this.tutorialHelperPanel.container,
            ...this.pointersImage,
        ])
        this.setPositionContainer()
        this.turnsTemplate = this.buildTurnsTemplate()
        this.turns = this.buildTurns()
        this.attachTweenCursor()
        this.registerClickNextTurn()
        this.nextTurn(this.currentTurnIndex)

        this.cameras.main.fadeIn(200, 0, 0, 0, (camera: any, percentage: number) => {
            if (percentage >= 1) {
                this.tutorialStartEndScene.state = 'start'
                this.tutorialStartEndScene.setText('Welcome to Spherebreak') 
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
            pointers: [{ x: 0, y: 0 }],
            text: '',
            sphere: 4,
            entries: [1, 2, 3, 4],
            borders: [8, 2, 9, 4, 7, 8, 2, 3, 1, 2, 4, 3],
            entriesActive: Array(4).fill(false),
            bordersActive: Array(12).fill(false),
            bordersAlive: Array(12).fill(false),
            entriesLigthing: Array(12).fill(false),
            bordersLigthing: Array(12).fill(false),
            timer: 30,
            turn: 1,
            score: 0,
            maxScore: 10,
            maxTurn: 10,
            comboCount: 0,
            comboMultiple: 0,
            comboCountGoal: 0,
            comboMultipleGoal: 0,
        }
    }

    buildTurnsTemplate(): Array<Partial<Turn>> {

        const entriesGraphicsPosition = this.board.bordersGraphics.map((border) => {
            return { x: border.x + this.board.container.x - 12, y: border.y + this.board.container.y }
        })
        
        return [
            {
                entriesActive: [false, true, false, false],
                comboMultipleGoal: 2,
                comboMultiple: 1,
            },
            {
                pointers: entriesGraphicsPosition,
                text: `12 coins that are in blue color
They are positioned in the corner
They dissappear after you use it
They increase the quota by one`,
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardRigthPanel.container.x - 16,
                        y: this.boardPanel.container.y + this.boardPanel.boardRigthPanel.container.y + 12,
                    },
                ],
                entriesActive: [false, true, false, false],
            },
        ]
    }

    buildTurns(): Array<Turn> {
        return this.turnsTemplate.map((turn) => {
            return { ...this.defaultTurn(), ...turn }
        })
    }

    registerClickNextTurn() {
        this.input.on(
            Phaser.Input.Events.POINTER_DOWN,
            () => {
                console.log(this.turns[this.currentTurnIndex].text)
                console.log(this.turns[this.currentTurnIndex].text !== '')
                if (this.currentTurnIndex === this.turns.length - 1) {
                    this.tutorialStartEndScene.state = 'end'
                    this.switchTutorial()
                } else {
                    if(this.turns[this.currentTurnIndex].text !== '' ) {
                        console.log('hello')
                        this.tutorialStartEndScene.setText(this.turns[this.currentTurnIndex].text)
                        this.switchTutorial()
                    } else {
                        this.nextTurn(this.currentTurnIndex)                        
                    }
                }
                this.currentTurnIndex += 1
            },
            this
        )
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
        currentTurn.entries.forEach((border: number, index: number) => {
            this.board.entriesGraphics[index].setText(border)
            if (currentTurn.entriesActive[index]) {
                this.board.entriesGraphics[index].setState('active')
            }
        })
        currentTurn.borders.forEach((border: number, index: number) => {
            this.board.bordersGraphics[index].setText(border)
            if (currentTurn.bordersActive[index]) {
                this.board.bordersGraphics[index].setState('active')
            }
        })
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
