export type Difficulty = 'easy' | 'medium' | 'hard' | 'veryHard'


export type GameInfo = {
    turn: number
    timer: number
    quota: number
}

export type GameConfig =  {
    difficulty: Difficulty
}


export type CoinState = 'inactive' | 'active' | 'dead' 
