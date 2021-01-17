import { Difficulty, GameInfo } from "./models"

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
        textStyle: {
            fontFamily: 'Play',
            fontSize: '14px',
            color: 'white',
            fontStyle: 'bold',
        }
    }
}

export class Config {
    public static readonly debug = process.env.DEBUG


    public static readonly images = {
        background: 'background'
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
        veryHard: {
            quota: 200,
            timer: 15,
            turn: 30,
        }
    }
    
    public static readonly scenes = {
        skip: {
            menu: false,
        },
        keys: {
            game: 'gameScene',
            gamePause: 'gamePauseScene',
            menu: 'menuScene',
            boot: 'bootScene',
        },
        game: {
            board: setBoard(),
            boardPanel: setBoardPanel(),
        },
        menu: {
            style: {
                fontFamily: 'Play',
                fontSize: '18px',
                color: 'white',
                fontStyle: 'bold',
            }
        },
    }
}
