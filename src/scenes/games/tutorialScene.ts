import { Config } from '~/config'
import { TutorialState } from '~/models'
import { Board } from '~/scenes/games/board'
import { BoardPanelContainer } from '~/scenes/games/panels/boardContainerPanel'
import { TutorialHelperPanel } from '~/scenes/games/panels/tutorialHelperPanel'

type Turn = {
    pointers: Array<{ x: number; y: number }>
    text: string
    sphere: number
    entries: Array<number>
    borders: Array<number>
    timer: number
    turn: number
    quota: number
    maxQuota: number
    maxTurn: number
    comboCount: number
    comboMultiple: number
    comboCountGoal: number | null
    comboMultipleGoal: number | null
}

export class TutorialScene extends Phaser.Scene {
    public tutorialState: TutorialState
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
        this.tutorialState = 'start'
        this.board = new Board(this, false)
        this.boardPanel = new BoardPanelContainer(this)
        this.tutorialHelperPanel = new TutorialHelperPanel(this)
        this.currentTurn = this.defaultTurn()
        this.currentTurnIndex = 0


        this.scene.launch(Config.scenes.keys.tutorialStartEnd)
        this.scene.sleep(Config.scenes.keys.tutorialStartEnd)

        this.cameras.main.fadeIn(300, 0, 0, 0, (camera: any, percentage: number) => {
            if(percentage >= 1) {
                this.startTutorial()            
            }
        })
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
        this.tutorialHelperPanel.create()
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
            this.tutorialHelperPanel.container,
            ...this.pointersImage,
        ])
        this.setPositionContainer()
        this.turnsTemplate = this.buildTurnsTemplate()
        this.turns = this.buildTurns()
        this.attachTweenCursor()
        this.registerClickNextTurn()
        this.nextTurn(this.currentTurnIndex)
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
            timer: 30,
            turn: 5,
            quota: 0,
            maxQuota: 10,
            maxTurn: 10,
            comboCount: 3,
            comboMultiple: 4,
            comboCountGoal: 3,
            comboMultipleGoal: 2,
        }
    }

    buildTurnsTemplate(): Array<Partial<Turn>> {
        const bordersGraphicsPosition = this.board.entriesGraphics.map((entry) => {
            return {
                x: entry.x + this.board.container.x + Config.board.entrySize + Config.board.entryPadding - 16,
                y: entry.y + this.board.container.y + Config.board.entrySize + Config.board.entryPadding,
            }
        })

        const entriesGraphicsPosition = this.board.bordersGraphics.map((border) => {
            return { x: border.x + this.board.container.x - 12, y: border.y + this.board.container.y }
        })

        return [
            {
                pointers: [
                    {
                        x: this.board.container.x + this.board.sphereGraphics.x - 16,
                        y: this.board.container.y + this.board.sphereGraphics.y,
                    },
                ],
                text: `Middle sphere is the numbero to reach
You can also reach it with a multiple
ex 4 -> 8
`,
            },
            {
                pointers: entriesGraphicsPosition,
                text: `12 coins that are in blue-purpish color
They are all positioned at the extreme corner
They dissappear after you use it`,
            },
            {
                pointers: bordersGraphicsPosition,
                text: `4 coins that are in yellowish color
They are positioned within the square borders
They never dissapear
They don't increase the quota`,
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardLeftPanel.container.x - 16,
                        y: this.boardPanel.container.y + this.boardPanel.boardLeftPanel.container.y + 12,
                    },
                ],
                text: `The game comes in turns
Every time you core break, the turn ends
You will need to complete the quota
before all the turns ends!`,
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardLeftPanel.container.x - 16,
                        y: this.boardPanel.container.y + this.boardPanel.boardLeftPanel.container.y + 32,
                    },
                ],
                text: `Quota is something like the score in the game
You get one quota for each border coin
You will need to reach the quota to win the game
`,
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardMiddlePanel.container.x - 12,
                        y: this.boardPanel.container.y + this.boardPanel.boardMiddlePanel.container.y + 24,
                    },
                ],
                text: `Every turn, there's a time limit
You need to make your decision using the coin
If the time runs out
you will automatically lose the turn`,
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardRigthPanel.container.x - 16,
                        y: this.boardPanel.container.y + this.boardPanel.boardRigthPanel.container.y + 12,
                    },
                ],
                text: `Example, you have a core number 2. 2,4,6,8
You have a sum of 8, combo
Next turn, you have a core number 3. 3,6,9,12
You make a sum of 12, combo
`,
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardRigthPanel.container.x - 16,
                        y: this.boardPanel.container.y + this.boardPanel.boardRigthPanel.container.y + 32,
                    },
                ],
                text: `example, you used 3 coins previous turn
if you use 3 coins, you increase your combo
if you use 2 coins, you lose the combo
`,
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
                if (this.currentTurnIndex === this.turns.length - 1) {
                    this.tutorialState = 'end'
                    this.endTutorial()
                } else {
                    this.currentTurnIndex += 1
                    this.nextTurn(this.currentTurnIndex)
                }
            },
            this
        )
    }

    nextTurn(index: number) {
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
        })
        currentTurn.borders.forEach((border: number, index: number) => {
            this.board.bordersGraphics[index].setText(border)
        })
        this.boardPanel.boardLeftPanel.setTurnText(currentTurn.turn, currentTurn.maxTurn)
        this.boardPanel.boardMiddlePanel.setTimerText(currentTurn.timer)
        this.boardPanel.boardLeftPanel.setQuotaText(currentTurn.quota, currentTurn.maxQuota)
        this.boardPanel.boardRigthPanel.setComboCountText(
            currentTurn.comboCount,
            currentTurn.comboMultipleGoal
        )
        this.boardPanel.boardRigthPanel.setComboMultipleText(
            currentTurn.comboMultiple,
            currentTurn.comboMultipleGoal
        )
        this.tutorialHelperPanel.setText(currentTurn.text)
    }

    startTutorial() {
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

    endTutorial() {
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
            this.scale.height / 2 -
                (Config.board.height +
                    Config.panels.board.height +
                    Config.panels.tutorial.height +
                    Config.panels.tutorial.marginTop +
                    Config.board.marginTop) /
                    2
        )
    }
}
