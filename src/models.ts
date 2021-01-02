export type Difficulty = 'easy' | 'medium' | 'hard'


export type GameInfo = {
    turn: number
    timer: number
    quota: number
}

export type GameConfig =  {
    difficulty: Difficulty
}


export type CoinState = 'alive' | 'dead' | 'active'
