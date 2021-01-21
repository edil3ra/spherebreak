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


export type CoinState = 'inactive' | 'active' | 'dead' 
