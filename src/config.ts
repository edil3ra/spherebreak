

function setCoin() {
    const CP = 16
    const EP = 12
    const CS = 88
    const ES = 92
    const SS = 66
    const BS = (CP + CS) * 4 
    
    return {
        coinPadding: CP,
        entryPadding: EP,
        coinSize: CS,
        entrySize: ES,
        sphereSize: SS,
        boardWidth: BS,
        boardHeight: BS,
    }
}

export class Config {
    public static readonly scenes = {
        keys: {
            game: 'gameScene',
            menu: 'menuScene',
            boot: 'bootScene',
        },
        game: {
            ...setCoin()
        }
    }
}
