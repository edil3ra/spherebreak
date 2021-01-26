import { Config } from '~/config'
import { Board } from '~/scenes/games/board'
import { BoardPanelContainer } from '~/scenes/games/panels/boardContainerPanel'
import { TutorialHelperPanel } from './panels/tutorialHelperPanel'

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
    public background: Phaser.GameObjects.Image
    public pointersImage: Array<Phaser.GameObjects.Image>
    public boardPanel: BoardPanelContainer
    public tutorialHelperPanel: TutorialHelperPanel
    public board: Board
    public turns: Array<Turn>
    public turnsTemplate: Array<Partial<Turn>>
    public currentTurn: Turn
    public tweenCursor: Phaser.Tweens.Tween

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
            },
            false
        )
        this.board = new Board(this)
        this.boardPanel = new BoardPanelContainer(this)
        this.tutorialHelperPanel = new TutorialHelperPanel(this)

        this.currentTurn = this.defaultTurn()
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
        this.board.setPosition()
        this.boardPanel.setPosition()
        this.turnsTemplate = this.buildTurnsTemplate()
        this.turns = this.buildTurns()
        this.attachTweenCursor()
        this.nextTurn(6)
    }

    attachTweenCursor() {
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
            turn: 1,
            quota: 0,
            maxQuota: 10,
            maxTurn: 10,
            comboCount: 0,
            comboMultiple: 0,
            comboCountGoal: null,
            comboMultipleGoal: null,
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
                text: `The sphere that is in bright blue.
It's positioned at the center of the board.
This cannot be selected
It act as the guide on the multiples
`
            },
            {
                pointers: entriesGraphicsPosition,
                text: `12 coins that are in blue-purpish in colour.
They are all positioned at the extreme corner,
thus the name border coins.
They dissappear after you use it.`,
            },
            {
                pointers: bordersGraphicsPosition,
                text: `4 coins that are in yellowish colour.
They are positioned within the square borders.
These entry coins will never dissappear, but
does not add to the quota every time you use it`,
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardLeftPanel.container.x - 16,
                        y: this.boardPanel.container.y + this.boardPanel.boardLeftPanel.container.y + 12,
                    },
                ],
                text: `The game comes in turns.
Every time you core break, the turn ends.
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
                text: `Quota is something like the score in the game.
You get one quota for each border coin.
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
                text: `Every turn, there's a time limit.
You need to make your decision using the coin.
If the time runs out,
you will automatically lose the turn`
            },
            {
                pointers: [
                    {
                        x: this.boardPanel.container.x + this.boardPanel.boardRigthPanel.container.x - 16,
                        y: this.boardPanel.container.y + this.boardPanel.boardRigthPanel.container.y + 12,
                    },
                ],
                text: `Example, you have a core number 2. 2,4,6,8...
You have a sum of 8, core break.
Next turn, you have a core number 3. 3,6,9,12...
You make a sum of 12, core break.
8 and 12 is a multiple of 4
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
`
            },
        ]
    }

    buildTurns(): Array<Turn> {
        return this.turnsTemplate.map((turn) => {
            return { ...this.defaultTurn(), ...turn }
        })
    }

    nextTurn(index: number) {
        const currentTurn = Object.assign({}, this.currentTurn, this.turns[index])
        currentTurn.pointers.forEach((pointer: { x: number; y: number }, index: number) => {
            this.pointersImage[index].setPosition(pointer.x, pointer.y).setVisible(true)
        })

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

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }
}
