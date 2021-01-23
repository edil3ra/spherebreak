import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'
import { CoinState, GameConfig, GameState } from '~/models'
import { Board } from '~/scenes/games/board'
import { BoardPanelContainer } from '~/scenes/games/panels/boardContainerPanel'
import { GameDataManager } from '~/scenes/games/gameDataManager'

export class GameScene extends Phaser.Scene {
    public data: GameDataManager
    public borderClickedIndex: number
    public entryClickedIndex: number
    public background: Phaser.GameObjects.Image
    public board: Board
    public boardPanel: BoardPanelContainer
    public timerSyncCoin: Phaser.Time.TimerEvent
    public timerTurn: Phaser.Time.TimerEvent
    public bordersStateChanged: Array<[CoinState, CoinGraphics]>

    constructor() {
        super({ key: Config.scenes.keys.game })
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
        this.data = new GameDataManager(this)
        this.registerDataEvents()
        this.board = new Board(this)
            .attachClickBorder(this.handleClickedBorder)
            .attachClickEntry(this.handleClickedEntry)
        
        this.boardPanel = new BoardPanelContainer(this)
        this.bordersStateChanged = []
        this.scene.launch(Config.scenes.keys.gameOver)
        this.scene.sleep(Config.scenes.keys.gameOver)

        if(Config.debug) {
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on('down', () => {
                this.scene.pause(Config.scenes.keys.game)
                this.scene.wake(Config.scenes.keys.gamePause)
            })            
        }
        
        this.events.on('wake', () => {
            this.tweens.add({
                ...Config.scenes.game.tweens.camera.in,
                targets: this.cameras.main,
                callbackScope: this,
            })
        })
        
        this.events.on('shutdown', () => {
            for (const event of Object.values(Config.events.game)) {
                this.events.off(event)
            }
        })
    }

    create(gameConfig: GameConfig) {
        this.setBackground()
        this.board.create()
        this.boardPanel.create()
        this.initData(gameConfig)
        this.initTimerSyncCoin()
        this.startTimerTurn()
    }

    initData(gameConfig: GameConfig) {
        const initialGameInfo = Config.difficulties[gameConfig.difficulty]
        this.data.maxTimer = initialGameInfo.timer
        this.data.maxTurn = initialGameInfo.turn
        this.data.maxQuota = initialGameInfo.quota
        this.data.entries = gameConfig.entries
        this.data.comboMultipleGoal = null
        this.data.comboCountGoal = null
        this.data.comboCount = 0
        this.data.comboMultiple = 0
        this.data.turn = 0
        this.data.quota = 0
        this.data.sphere = this.data.pickNewRandomNumber()
        this.data.borders = this.data.borders.map((_border) => this.data.pickNewRandomNumber())
    }

    registerDataEvents() {
        this.events.on(Config.events.game.CHANGEDATA_SPHERE, (_scene: GameScene, value: number) => {
            this.board.sphereGraphics.setText(value)
            this.board.sphereGraphics.revive()
        })

        this.events.on(Config.events.game.CHANGEDATA_ENTRIES, (_scene: GameScene, entries: Array<number>) => {
            entries.forEach((entry: number, index: number) => {
                this.board.entriesGraphics[index].setText(entry)
            })
        })

        this.events.on(Config.events.game.CHANGEDATA_BORDERS, (_scene: GameScene, borders: Array<number>) => {
            borders.forEach((border: number, index: number) => {
                this.board.bordersGraphics[index].setText(border)
            })
        })

        this.events.on(Config.events.game.CHANGEDATA_TURN, (_scene: GameScene, turn: number) => {
            this.boardPanel.boardLeftPanel.setTurnText(turn, this.data.maxTurn)
        })

        this.events.on(Config.events.game.CHANGEDATA_TIMER, (_scene: GameScene, timer: number) => {
            this.boardPanel.boardMiddlePanel.setTimerText(timer)
            if (timer === 0) {
                this.data.nextTurn()
            }
        })

        this.events.on(Config.events.game.CHANGEDATA_QUOTA, (_scene: GameScene, quota: number) => {
            this.boardPanel.boardLeftPanel.setQuotaText(quota, this.data.maxQuota)
        })

        this.events.on(
            Config.events.game.CHANGEDATA_COMBO_COUNT,
            (_scene: GameScene, newComboCount: number) => {
                this.boardPanel.boardRigthPanel.setComboCountText(newComboCount, this.data.comboCountGoal)
            }
        )

        this.events.on(
            Config.events.game.CHANGEDATA_COMBO_COUNT_GOAL,
            (_scene: GameScene, newComboCountGoal: number) => {
                this.boardPanel.boardRigthPanel.setComboCountText(this.data.comboCount, newComboCountGoal)
            }
        )

        this.events.on(
            Config.events.game.CHANGEDATA_COMBO_MULTIPLE,
            (_scene: GameScene, newComboMultiple: number) => {
                this.boardPanel.boardRigthPanel.setComboMultipleText(
                    newComboMultiple,
                    this.data.comboMultipleGoal
                )
            }
        )

        this.events.on(
            Config.events.game.CHANGEDATA_COMBO_MULTIPLE_GOAL,
            (_scene: GameScene, newComboMultipleGoal: number) => {
                this.boardPanel.boardRigthPanel.setComboMultipleText(
                    this.data.comboMultiple,
                    newComboMultipleGoal
                )
            }
        )

        this.events.on(
            Config.events.game.CHANGEDATA_BORDERS_ACTIVE,
            (_scene: GameScene, _borders: Array<boolean>) => {
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
            }
        )

        this.events.on(
            Config.events.game.CHANGEDATA_ENTRIES_ACTIVE,
            (_scene: GameScene, _borders: Array<boolean>) => {
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
            }
        )

        this.events.on(
            Config.events.game.CHANGEDATA_BORDERS_ALIVE,
            (_scene: GameScene, _borders: Array<boolean>) => {
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
            }
        )

        this.events.on(Config.events.game.FINISH_TURN, () => {
            this.startTimerTurn()
        })

        this.events.on(Config.events.game.CHANGEDATA_GAME_STATE, (_scene: GameScene, state: GameState) => {
            switch (state) {
                case 'play':
                    break
                case 'win':
                    this.tweens.add({
                        ...Config.scenes.game.tweens.camera.out,
                        targets: this.cameras.main,
                        onComplete: () => {
                            this.scene.pause(Config.scenes.keys.game)
                            this.scene.wake(Config.scenes.keys.gameOver)
                            this.scene.bringToTop(Config.scenes.keys.gameOver)
                        },
                    })
                    
                    break
                case 'lost':
                    this.tweens.add({
                        ...Config.scenes.game.tweens.camera.out,
                        targets: this.cameras.main,
                        onComplete: () => {
                            this.scene.pause(Config.scenes.keys.game)
                            this.scene.wake(Config.scenes.keys.gameOver)
                            this.scene.bringToTop(Config.scenes.keys.gameOver)
                        },
                    })
                    break
            }
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

    startTimerTurn() {
        this.data.timer = this.data.maxTimer
        this.timerTurn = this.time.addEvent({
            repeat: this.data.maxTimer - 1,
            delay: 1000,
        })
        this.timerTurn.callback = () => {
            this.data.timer = this.timerTurn.repeatCount
        }
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    handleClickedBorder(index: number) {
        this.borderClickedIndex = index
        this.data.bordersActive = this.data.bordersActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.data.nextTurn()
    }

    handleClickedEntry(index: number) {
        this.entryClickedIndex = index
        this.data.entriesActive = this.data.entriesActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.data.nextTurn()
    }
}
