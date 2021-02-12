import { Difficulty, GameInfo } from '~/models'

type SkipScene = 'noSkip' | 'game' | 'tutorial'

const AFTER_TURN_TIMER = 220
const BORDER_PADDING = 4
const BORDER_SIZE = 84
const ENTRY_SIZE = 80
const ENTRY_PADDING = 8
const SPHERE_SIZE = 60
const BOARD_SIZE = BORDER_PADDING * 3 + BORDER_SIZE * 4
function setBoard() {
    return {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        borderPadding: BORDER_PADDING,
        borderSize: BORDER_SIZE,
        entrySize: ENTRY_SIZE,
        entryPadding: ENTRY_PADDING,
        sphereSize: SPHERE_SIZE,
        marginTop: 10,
        styles: {
            score: {
                fontFamily: 'Play',
                fontSize: '50px',
                color: 'white',
                fontStyle: 'bold', 
            }
        }
    }
}

function setBoardPanel() {
    return {
        width: BOARD_SIZE,
        height: 100,
        topPadding: 32,
        leftPadding: 28,
        offsetItem: 20,
        middlePanelOffsetX: 141,
        middlePanelOffsetY: 19,
        rightPanelOffsetX: 192,
        tweens: {
            base: {
                scale: {
                    from: 1.6,
                    to: 1,
                },
                ease: 'Sine.easeInOut',
                duration: AFTER_TURN_TIMER,
            },
            setTimer: {
                scale: {
                    from: 1.2,
                    to: 1,
                },
                ease: 'Sine.easeInOut',
                duration: AFTER_TURN_TIMER * 0.5,
            },
            resetTimer: {
                scale: {
                    from: 1.8,
                    to: 1,
                },
                ease: 'Sine.easeInOut',
                duration: AFTER_TURN_TIMER + 100,
            },
            

        },
        styles: {
            text: {
                fontFamily: 'Play',
                fontSize: '13px',
                color: 'white',
                fontStyle: 'bold', 
            },
            timer: {
                fontFamily: 'Play',
                fontSize: '38px',
                color: 'white',
                fontStyle: 'bold', 
            },
        }
    }
}


function setTutorialPanel() {
    return {
        width: BOARD_SIZE,
        height: 170,
        paddingX: 20,
        paddingY: 40,
        marginTop: 10,
        styles: {
            text: {
                fontSize: '14px',
                lineSpacing: 2,
                color: 'white',
            }
        },
    }
}


export class Config {
    public static readonly debug = process.env.DEBUG
    public static readonly ads = {
        play: false,
        playAgain: true
    }

    public static readonly mute = Config.debug ? true : true
    
    public static readonly images = {
        background: 'background',
    }
    
    public static readonly sounds = {
        click: 'assets/sounds/click1.ogg',
        switch: 'assets/sounds/switch1.ogg',
        pling1: 'assets/sounds/pling1.mp3',
        pling2: 'assets/sounds/pling2.mp3',
        pling3: 'assets/sounds/pling3.mp3',
        pling4: 'assets/sounds/pling4.mp3',
        pling5: 'assets/sounds/pling5.mp3',
        pling6: 'assets/sounds/pling6.mp3',
        pling7: 'assets/sounds/pling7.mp3',
        pling8: 'assets/sounds/pling8.mp3',
        pling9: 'assets/sounds/pling9.mp3',
        engine: 'assets/sounds/engine1.ogg',
        gameover: 'assets/sounds/gameover4.ogg',
    }
    
    public static readonly packer = {
        name: 'packer',
        background: 'background-main.jpg',
        bannerHanging: 'bannerHanging.png',
        bannerModern: 'bannerModern.png',
        bannerScroll: 'bannerScroll.png',
        gameInfoPannel: 'gameInfoPannel.png',
        wood: 'wood.png',
        coinEntry: 'coin-entry.gif',
        coinSphere: 'sphere.png',
        menuButton: 'button_rectangleWood.png',
        coinBorder: 'coin.gif',
        pattern: 'patternStripesMetal_large.png',
        hand: 'hand_cursor0000.png',
        emitterBlue: 'blue.png',
        emitterRed: 'red.png',
        soundOn: 'sound-on.png',
        soundOff: 'sound-off.png',
        difficulties: {
            easy: 'dragon.png',
            medium: 'dragon-head.png',
            hard: 'double-dragon.png',
            insane: 'dragon-spiral.png',
        },
    }

    public static readonly difficulties: Record<Difficulty, GameInfo> = {
        easy: {
            quota: 50,
            timer: 60,
            turn: 15,
        },
        medium: {
            quota: 80,
            timer: 45,
            turn: 20,
        },
        hard: {
            quota: 200,
            timer: 30,
            turn: 25,
        },
        insane: {
            quota: 500,
            timer: 15,
            turn: 30,
        },
    }


    public static readonly events = {
        game: {
            CHANGEDATA_SPHERE: 'changedata-sphere',
            CHANGEDATA_ENTRIES: 'changedata-entries',
            CHANGEDATA_BORDERS: 'changedata-borders',
            CHANGEDATA_TURN: 'changedata-turn',
            CHANGEDATA_TIMER: 'changedata-timer',
            CHANGEDATA_QUOTA: 'changedata-quota',
            CHANGEDATA_COMBO_COUNT: 'changedata-comboCount',
            CHANGEDATA_COMBO_COUNT_GOAL: 'changedata-comboCountGoal',
            CHANGEDATA_COMBO_MULTIPLE: 'changedata-comboMultiple',
            CHANGEDATA_COMBO_MULTIPLE_GOAL: 'changedata-comboMultipleGoal',
            CHANGEDATA_BORDERS_ACTIVE: 'changedata-bordersActive',
            CHANGEDATA_ENTRIES_ACTIVE: 'changedata-entriesActive',
            CHANGEDATA_BORDERS_ALIVE: 'changedata-bordersAlive',
            CHANGEDATA_GAME_STATE: 'changedata-gameState',
        }
    }
    public static readonly board = setBoard()
    public static readonly panels = {
        board: setBoardPanel(),
        tutorial: setTutorialPanel(),
    }

    public static readonly scenes = {
        skip: {
            scene: Config.debug ?  'noSkip' : 'noSkip',
        },
        keys: {
            game: 'gameScene',
            gamePause: 'gamePauseScene',
            gameOver: 'gameOverScene',
            menu: 'menuScene',
            boot: 'bootScene',
            entriesSelection: 'entriesSelectionScene',
            tutorial: 'tutorialScene',
            tutorialStartEnd: 'tutorialStartEndScene',
        },
        menu: {
            logState: false,
            background: {
                width: 375,
                height: 380,
            },
            entriesContainer: {
                x: -174,
                y: 70,
            },
            difficultiesContainer: {
                x: 10,
                y: 70,
            },
            entries: {
                width: 78,
                height: 78,
                textBottomPadding: 40,
                textLeftPadding: 48,
                xPadding: 6,
                yPadding: 6,
            },
            helperEntries: {
                width: 110,
                height: 110,
                xPadding: 16,
                yPadding: 16,
            },
            difficulties: {
                width: 78,
                height: 78,
                textBottomPadding: 40,
                textLeftPadding: 16,
                xPadding: 6,
                yPadding: 6,
            },
            buttonPlay: {
                x: -110,
                y: 324,
            },
            buttonTutorial: {
                x: 34,
                y: 324,
            },
            soundImage: {
                x: 144,
                y: 324,
            },
            tweens: {
                camera: {
                    in: {
                        alpha: 1,
                        ease: 'Sine.easeInOut',
                        duration: 100,
                    },
                    out: {
                        alpha: 0.4,
                        ease: 'Sine.easeInOut',
                        duration: 100,
                    },
                },
            },
            styles: {
                button: {
                    fontFamily: 'Play',
                    fontSize: '18px',
                    color: 'white',
                    fontStyle: 'bold',
                },
                coin: {
                    fontFamily: 'Play',
                    fontSize: '30px',
                    color: 'white',
                    fontStyle: 'bold',
                },
                numero: {
                    fontFamily: 'Play',
                    fontSize: '40px',
                    color: 'white',
                    fontStyle: 'bold',
                },
                helper: {
                    fontFamily: 'Play',
                    fontSize: '50px',
                    color: 'white',
                    fontStyle: 'bold',
                },
            },
        },
        game: {
            reviveAfterTurn: 5,
            textTimer: 1000,
            coinAnimationTimer: 160,
            afterTurnTimer: AFTER_TURN_TIMER,
            afterTurnShakeIntensity: 0.0025,
            tweens: {
                camera: {
                    in: {
                        alpha: 1,
                        ease: 'Sine.easeInOut',
                        duration: 100,
                    },
                    out: {
                        alpha: 0.4,
                        ease: 'Sine.easeInOut',
                        duration: 100,
                    },
                },
            },
        },
        gameOver: {
            button: {
                width: 150,
                height: 100,
                padding: 20,
            },
            styles: {
                button: {
                    fontFamily: 'Play',
                    fontSize: '18px',
                    color: 'white',
                    fontStyle: 'bold',
                },
                text: {
                    fontFamily: 'Play',
                    fontSize: '50px',
                    color: 'white',
                    fontStyle: 'bold',
                }
            }
        },
        tutorialStartEndScene: {
            styles: {
                text: {
                    fontFamily: 'Play',
                    fontSize: '20px',
                    color: 'white',
                    fontStyle: 'bold',
                }
            }
        }
    }
}
