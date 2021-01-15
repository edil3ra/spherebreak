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
        topPadding: 22,
        leftPadding: 40,
        offsetItem: 20,
        rightPanelOffsetX: 180,
    }
}

export class Config {
    public static readonly debug = process.env.DEBUG
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
    }
    
    public static readonly scenes = {
        skip: {
            menu: Config.debug,
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
    }
}
