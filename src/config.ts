

function setCoin() {
    const CP = 14
    const EP = 12
    const CS = 94
    const ES = 98
    const SS = 70
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
