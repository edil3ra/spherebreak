const BORDER_PADDING = 16
const BORDER_SIZE = 94
const ENTRY_SIZE = 98
const ENTRY_PADDING = 12
const SPHERE_SIZE = 70
const BOARD_SIZE = (BORDER_PADDING * 3) + (BORDER_SIZE * 4)

function setBoard() {
    return {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        borderPadding: BORDER_PADDING,
        borderSize: BORDER_SIZE,
        entrySize: ENTRY_SIZE,
        entryPadding: ENTRY_PADDING,
        sphereSize: SPHERE_SIZE ,
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
    public static readonly scenes = {
        keys: {
            game: 'gameScene',
            gamePause: 'gamePauseScene',
            menu: 'menuScene',
            boot: 'bootScene',
        },
        game: {
            board: setBoard(),
            boardPanel: setBoardPanel()
        }
    }
}
