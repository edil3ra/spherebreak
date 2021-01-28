import { Difficulty, GameInfo } from './models'

type SkipScene = 'noSkip' | 'game' | 'tutorial'

const BORDER_PADDING = 16
const BORDER_SIZE = 94
const ENTRY_SIZE = 98
const ENTRY_PADDING = 12
const SPHERE_SIZE = 70
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
    }
}

function setBoardPanel() {
    return {
        width: BOARD_SIZE,
        height: 100,
        topPadding: 32,
        leftPadding: 32,
        offsetItem: 20,
        middlePanelOffsetX: 144,
        rightPanelOffsetX: 242,
        styles: {
            text: {
                fontFamily: 'Play',
                fontSize: '14px',
                color: 'white',
                fontStyle: 'bold', 
            },
            timer: {
                fontFamily: 'Play',
                fontSize: '42px',
                color: 'white',
                fontStyle: 'bold', 
            }
        }
    }
}


function setTutorialPanel() {
    return {
        width: BOARD_SIZE,
        height: 160,
        paddingX: 36,
        paddingY: 46,
        styles: {
            text: {
                fontSize: '13px',
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


    public static readonly images = {
        background: 'background',
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
        difficulties: {
            easy: 'dragon.png',
            medium: 'dragon-head.png',
            hard: 'double-dragon.png',
            insane: 'dragon-spiral.png',
        },
    }

    public static readonly difficulties: Record<Difficulty, GameInfo> = {
        easy: {
            quota: 20,
            timer: 60,
            turn: 15,
        },
        medium: {
            quota: 50,
            timer: 45,
            turn: 20,
        },
        hard: {
            quota: 100,
            timer: 30,
            turn: 20,
        },
        insane: {
            quota: 200,
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
            FINISH_TURN: 'finishTurn',
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
            entriesContainer: {
                x: -240,
                y: 80,
            },
            difficultiesContainer: {
                x: 48,
                y: 80,
            },
            entries: {
                width: 96,
                height: 96,
                textBottomPadding: 40,
                textLeftPadding: 68,
                xPadding: 10,
                yPadding: 10,
            },
            helperEntries: {
                width: 140,
                height: 140,
                xPadding: 16,
                yPadding: 16,
            },
            difficulties: {
                width: 92,
                height: 92,
                textBottomPadding: 40,
                textLeftPadding: 40,
                xPadding: 10,
                yPadding: 10,
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
                width: 200,
                height: 100,
                padding: 20,
            },
            styles: {
                button: {
                    fontFamily: 'Play',
                    fontSize: '24px',
                    color: 'black',
                    fontStyle: 'bold',
                },
                text: {
                    fontFamily: 'Play',
                    fontSize: '60px',
                    color: 'white',
                    fontStyle: 'bold',
                }
            }
        },
        tutorialStartEndScene: {
            styles: {
                text: {
                    fontFamily: 'Play',
                    fontSize: '24px',
                    color: 'white',
                    fontStyle: 'bold',
                }
            }
        }

    }
}
