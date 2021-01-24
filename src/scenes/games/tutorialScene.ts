import { Config } from '~/config'
import { Board } from '~/scenes/games/board'
import { BoardPanelContainer } from '~/scenes/games/panels/boardContainerPanel'

type Turn = {
    pointer: { x: number; y: number }
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
    public pointer: Phaser.GameObjects.Image
    public board: Board
    public boardPanel: BoardPanelContainer
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
                this.board.setBoardContainerPosition()
                this.boardPanel.setPosition()
            },
            false
        )
        this.board = new Board(this)
        this.boardPanel = new BoardPanelContainer(this)
        this.currentTurn = this.defaultTurn()
    }

    create() {
        this.setBackground()
        this.board.create()
        this.boardPanel.create()
        this.pointer = this.add.image(0, 0, Config.packer.name, Config.packer.hand)
        this.boardPanel.boardRigthPanel.setComboCountText(0, 0)
        this.boardPanel.boardRigthPanel.setComboMultipleText(0, 0)
        this.board.setBoardContainerPosition()
        this.boardPanel.setPosition()
        this.turnsTemplate = this.buildTurnsTemplate()
        this.turns = this.buildTurns()

        // this.tweenCursor = this.tweens.add()

        this.tweenCursor = this.tweens.add({
            targets: this.pointer,
            x: '-=10',
            ease: 'Sine.easeInOut',
            duration: 400,
            repeat: -1,
            yoyo: true,
        })

        this.nextTurn(0)
    }

    defaultTurn(): Turn {
        return {
            pointer: { x: 0, y: 0 },
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
        return [
            {
                pointer: {
                    x: this.boardPanel.container.x + this.boardPanel.boardLeftPanel.container.x - 16,
                    y: this.boardPanel.container.y + this.boardPanel.boardLeftPanel.container.y + 10,
                },
                text: 'first text',
            },
            {
                pointer: {
                    x: this.boardPanel.boardLeftPanel.container.x,
                    y: this.boardPanel.boardLeftPanel.container.y,
                },
                text: 'secord text',
            },
            {
                pointer: {
                    x: this.boardPanel.boardMiddlePanel.timerText.x,
                    y: this.boardPanel.boardMiddlePanel.timerText.y,
                },
                text: 'third text',
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
        this.pointer.setPosition(currentTurn.pointer.x, currentTurn.pointer.y)

        this.board.sphereGraphics.setText(currentTurn.sphere)
        currentTurn.entries.forEach((entry: number, index: number) => {
            this.board.entriesGraphics[index].setText(entry)
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
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }
}
