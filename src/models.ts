export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane'
export type CoinType = 'sphere' | 'border' | 'entry' 

export type GameInfo = {
    turn: number
    timer: number
    quota: number
}

export type GameConfig =  {
    difficulty: Difficulty
    entries: Array<number>
}

export type GameState =  'startGame' | 'winGame' | 'loseGame' | 'winTurn' | 'loseTurn' 
export type CoinState = 'inactive' | 'active' | 'dead' | 'focus' | 'unfocus'
export type TutorialState =  'start' | 'middle' | 'end'

