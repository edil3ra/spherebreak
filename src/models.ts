export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane'
export type CoinType = 'sphere' | 'border' | 'entry'

export type GameInfo = {
    turn: number
    timer: number
    quota: number
}

export type GameConfig = {
    difficulty: Difficulty
    entries: Array<number>
}

export type GameState = 'startGame' | 'winGame' | 'loseGame' | 'winTurn' | 'loseTurn'
export type CoinState = 'inactive' | 'active' | 'dead' | 'focus' | 'unfocus'
export type TutorialState = 'start' | 'middle' | 'end'

export type plingKeys = 
    | 'pling1'
    | 'pling2'
    | 'pling3'
    | 'pling4'
    | 'pling5'
    | 'pling6'
    | 'pling7'
    | 'pling8'
    | 'pling9'

export type SoundKeys =
    | 'click'
    | 'switch'
    | 'engine'
    | 'gameover'
    | plingKeys

export type SoundModel = {
    name: SoundKeys
    webPath: string
    androidPath: string
}
