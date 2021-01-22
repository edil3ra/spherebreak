export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane'


export type GameInfo = {
    turn: number
    timer: number
    quota: number
}

export type GameConfig =  {
    difficulty: Difficulty
    entries: Array<number>
}

export type GameState =  'play' | 'lost' | 'win'


export type CoinState = 'inactive' | 'active' | 'dead' 
