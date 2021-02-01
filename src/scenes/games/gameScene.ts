import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'
import { CoinState, GameConfig, GameState } from '~/models'
import { Board } from '~/scenes/games/board'
import { BoardPanelContainer } from '~/scenes/games/panels/boardContainerPanel'
import { GameDataManager } from '~/scenes/games/gameDataManager'

export class GameScene extends Phaser.Scene {
    public data: GameDataManager
    public background: Phaser.GameObjects.Image
    public board: Board
    public boardPanel: BoardPanelContainer
    public timerSyncCoin: Phaser.Time.TimerEvent
    public timerTurn: Phaser.Time.TimerEvent
    public bordersStateChanged: Array<[CoinState, CoinGraphics]>
    public container: Phaser.GameObjects.Container
    public plings: Array<Phaser.Sound.BaseSound>
    public gameover: Phaser.Sound.BaseSound
    public engine: Phaser.Sound.BaseSound
    public emitterEndGame: Phaser.GameObjects.Particles.ParticleEmitter
    public emitterExplodeBlue: Phaser.GameObjects.Particles.ParticleEmitter
    public emitterExplodeRed: Phaser.GameObjects.Particles.ParticleEmitter

    constructor() {
        super({ key: Config.scenes.keys.game })
    }

    init() {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
                this.setPositionContainer()
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

        if (Config.debug) {
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on('down', () => {
                this.scene.pause(Config.scenes.keys.game)
                this.scene.wake(Config.scenes.keys.gamePause)
            })
        }
        this.cameras.main.fadeIn(300, 0, 0, 0)
        this.events.on('wake', () => {
            this.cameras.main.fadeIn(300, 0, 0, 0)
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
        this.container = this.add.container(0, 0, [this.board.container, this.boardPanel.container])
        this.setPositionContainer()
        this.initData(gameConfig)
        this.initTimerSyncCoin()
        this.startTimerTurn()
        this.registerEmitters()
        this.registerSounds()
    }

    initData(gameConfig: GameConfig) {
        const initialGameInfo = Config.difficulties[gameConfig.difficulty]
        this.data.maxTimer = initialGameInfo.timer
        this.data.timer = this.data.maxTimer
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

            if (timer === this.data.maxTimer) {
                console.log('reset timer')
                this.boardPanel.boardMiddlePanel.resetTimerText(timer)
            } else {
                console.log('set Timer')
                this.boardPanel.boardMiddlePanel.setTimerText(timer)
            }
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
                        this.playSoundOnCoinActive()
                        this.playAnimationOnCoinActive()
                        this.board.bordersGraphics[index].setState('focus')
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
            (_scene: GameScene, _entries: Array<boolean>) => {
                const activeChanged = this.data.entriesActiveIndexesChanged.map((index) => {
                    if (this.data.entriesActive[index]) {
                        this.playSoundOnCoinActive()
                        this.playAnimationOnCoinActive()
                        this.board.entriesGraphics[index].setState('focus')
                        return ['active', this.board.entriesGraphics[index]]
                    } else {
                        this.board.entriesGraphics[index].setState('unfocus')
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

        this.events.on(Config.events.game.CHANGEDATA_GAME_STATE, (_scene: GameScene, state: GameState) => {
            switch (state) {
                case 'startGame':
                    break
                case 'winTurn':
                    this.cameras.main.shake(
                        Config.scenes.game.afterTurnTimer,
                        Config.scenes.game.afterTurnShakeIntensity,
                        true,
                        (_camera: any, duration: number) => {
                            if(duration === 1) {
                                this.startTimerTurn()                                
                            }
                        }
                    )
                    break
                case 'loseTurn':
                    this.cameras.main.shake(
                        Config.scenes.game.afterTurnTimer,
                        Config.scenes.game.afterTurnShakeIntensity,
                        true,
                        (_camera: any, duration: number) => {
                            if(duration === 1) {
                                this.startTimerTurn()                                
                            }
                        }
                    )
                    break
                case 'winGame':
                    this.handleWin()
                    break
                case 'loseGame':
                    this.handleLose()
                    break
            }
        })
    }

    registerSounds() {
        this.plings = [
            this.sound.add(Config.sounds.pling1, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling2, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling3, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling4, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling5, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling6, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling7, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling8, { volume: 0.3 }),
            this.sound.add(Config.sounds.pling9, { volume: 0.3 }),
        ]
        this.gameover = this.sound.add(Config.sounds.gameover, { volume: 0.3 })
        this.engine = this.sound.add(Config.sounds.engine, { volume: 0.3 })
    }

    registerEmitters() {
        this.emitterEndGame = this.add.particles(Config.packer.name, Config.packer.emitterRed).createEmitter({
            x: this.scale.width * 0.5,
            y: this.scale.height * 0.5 + Config.panels.board.height * 0.5,
            speed: 200,
            scale: 1,
            blendMode: Phaser.BlendModes.ADD,
            frequency: 20,
            active: false,
        })

        this.emitterExplodeBlue = this.add
            .particles(Config.packer.name, Config.packer.emitterBlue)
            .createEmitter({
                speed: { min: -600, max: 600 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.5, end: 0 },
                blendMode: 'SCREEN',
                lifespan: 300,
                gravityY: 100,
                active: false,
            })

        this.emitterExplodeRed = this.add
            .particles(Config.packer.name, Config.packer.emitterRed)
            .createEmitter({
                speed: { min: -600, max: 600 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.5, end: 0 },
                blendMode: 'SCREEN',
                lifespan: 300,
                gravityY: 100,
                active: false,
            })
    }

    initTimerSyncCoin() {
        if (this.timerSyncCoin) {
            this.timerSyncCoin.destroy()
        }
        this.timerSyncCoin = this.time.addEvent({
            delay: Config.scenes.game.coinAnimationTimer * 2,
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
        if (this.timerTurn) {
            this.timerTurn.destroy()
        }
        this.timerTurn = this.time.addEvent({
            repeat: this.data.maxTimer - 1,
            delay: Config.scenes.game.textTimer,
            callback: () => {
                this.data.timer = this.timerTurn.repeatCount
            },
        })
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    handleClickedBorder(index: number) {
        this.data.bordersActive = this.data.bordersActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.data.nextTurn()
    }

    handleClickedEntry(index: number) {
        this.data.entriesActive = this.data.entriesActive.map((value, loopingIndex) =>
            index === loopingIndex ? true : value
        )
        this.data.nextTurn()
    }

    setPositionContainer() {
        this.container.setPosition(
            this.scale.width / 2 - Config.board.width / 2,
            this.scale.height / 2 - (Config.board.height + Config.panels.board.height + 10) / 2
        )
    }

    playSoundOnCoinActive() {
        this.plings[this.data.lengthActives % this.plings.length].play()
    }

    playAnimationOnCoinActive() {
        this.emitterExplodeBlue.explode(2, this.input.mousePointer.x, this.input.mousePointer.y)
        this.emitterExplodeBlue.active = true
        this.emitterExplodeRed.explode(2, this.input.mousePointer.x, this.input.mousePointer.y)
        this.emitterExplodeRed.active = true
    }

    handleLose() {
        this.handleEndGame(Config.packer.emitterRed, new Phaser.Display.Color(255, 100, 100))
    }

    handleWin() {
        this.handleEndGame(Config.packer.emitterBlue, new Phaser.Display.Color(100, 100, 255))
    }

    handleEndGame(frame: string, color: Phaser.Display.Color) {
        this.emitterEndGame.active = true
        this.emitterEndGame.setFrame(frame)

        let enginePlay = false
        let gameOverPlay = false

        this.cameras.main.shake(2000, 0.002, false, (_camera: any, duration: number) => {
            if (!enginePlay) {
                this.engine.play()
                enginePlay = true
            }

            if (duration === 1) {
                this.cameras.main.flash(
                    1000,
                    color.red,
                    color.green,
                    color.blue,
                    false,
                    (_camera: any, duration: number) => {
                        if (!gameOverPlay) {
                            gameOverPlay = true
                            this.gameover.play()
                            this.emitterEndGame.setAngle(-90)
                            this.emitterEndGame.setGravityY(-8000)
                            this.emitterEndGame.stop()
                        }
                        if (duration >= 0.1) {
                            this.emitterEndGame.setGravityY(4000)
                        }

                        if (duration >= 0.8) {
                            this.emitterEndGame.active = false
                            this.emitterEndGame.killAll()
                        }

                        if (duration >= 1) {
                            this.scene.pause(Config.scenes.keys.game)
                            this.scene.wake(Config.scenes.keys.gameOver)
                            this.scene.bringToTop(Config.scenes.keys.gameOver)
                        }
                    }
                )
            }
        })
    }
}
