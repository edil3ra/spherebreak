import { Config } from '~/config'
import { GameState } from '~/models'
import { GameScene } from '~/scenes/games'

export class GameDataManager extends Phaser.Data.DataManager {
    public bordersActiveIndexesChanged: Array<number>
    public bordersAliveIndexesChanged: Array<number>
    public bordersDeadCount: Array<number>
    public entriesActiveIndexesChanged: Array<number>
    public reviveAfterTurn: number
    constructor(scene: GameScene) {
        super(scene)
        this.turn = 0
        this.timer = 0
        this.quota = 0
        this.gameState = 'play'
        this.maxTurn = 0
        this.maxQuota = 0
        this.comboCount = 0
        this.comboMultiple = 0
        this.comboMultipleGoal = null
        this.comboCountGoal = null
        this.ratioCreateBorders = 0
        this.sphere = 0

        this.entries = new Array(4).fill(0)
        this.entriesActiveIndexesChanged = []
        this.set('entriesActive', new Array(4).fill(false))

        this.borders = new Array(12).fill(0)
        this.set('bordersActive', new Array(12).fill(false))
        this.set('bordersAlive', new Array(12).fill(true))
        this.bordersDeadCount = new Array(12).fill(0)
        this.bordersActiveIndexesChanged = []
        this.bordersAliveIndexesChanged = []
        this.reviveAfterTurn = Config.scenes.game.reviveAfterTurn
    }

    get total(): number {
        const activeBorders = this.borders.filter(
            (_border: number, index: number) => this.bordersActive[index]
        )
        const activeEntries = this.entries.filter(
            (_entry: number, index: number) => this.entriesActive[index]
        )

        return (
            activeBorders.reduce((previous: number, current: number) => previous + current, 0) +
            activeEntries.reduce((previous: number, current: number) => previous + current, 0)
        )
    }

    get comboCountCurrent(): number {
        const activeBorders = this.borders.filter(
            (_border: number, index: number) => this.bordersActive[index]
        )
        const activeEntries = this.entries.filter(
            (_entry: number, index: number) => this.entriesActive[index]
        )
        return activeBorders.length + activeEntries.length
    }

    get comboMultipleCurrent(): number {
        return Math.floor(this.total / this.sphere)
    }

    comboPointByKey(combo: number): number {
        if (combo === 0) {
            return 0
        } else {
            return (combo - 1) * 2
        }
    }

    get comboCountPoint(): number {
        return this.comboPointByKey(this.comboCount)
    }

    get comboMultiplePoint(): number {
        return this.comboPointByKey(this.comboMultiple)
    }

    get point(): number {
        return (
            this.bordersActive.filter((borderAlive) => borderAlive).length +
            this.comboCountPoint +
            this.comboMultiplePoint
        )
    }

    isTotalMultipleOfSphere() {
        return this.total !== 0 ? this.total % this.sphere === 0 : false
    }

    isTimerOver() {
        return this.timer === 0
    }

    isAllSphereActive() {
        const hasNoEntries = this.entriesActive.every((entryActive) => entryActive)
        let hasNoBorders = false
        for (let i = 0; i < this.bordersActive.length; i++) {
            hasNoBorders = this.bordersActive[i] || !this.bordersAlive[i]
        }
        console.log('hasNoBorders')
        console.log(hasNoBorders)
        console.log('hasNoEntries')
        console.log(hasNoEntries)

        return hasNoBorders && hasNoEntries
    }

    isMaxTurnReached() {
        return this.turn >= this.maxTurn
    }

    isQuotaReached() {
        return this.quota >= this.maxQuota
    }

    nextTurn() {
        if (this.isTotalMultipleOfSphere()) {
            this.handleWinTurn()
        } else if (this.isAllSphereActive() || this.isTimerOver()) {
            this.handleLoseTurn()
        }

        if (this.isMaxTurnReached()) {
            this.gameState = 'lost'
        } else if (this.isQuotaReached()) {
            this.gameState = 'win'
        }
    }

    handleWinTurn() {
        if (this.comboMultipleGoal === null) {
            this.comboMultipleGoal = this.comboMultipleCurrent
            this.comboMultiple = 1
        } else {
            if (this.comboMultipleGoal === this.comboMultipleCurrent) {
                this.comboMultiple = this.comboMultiple + 1
            } else {
                this.comboMultipleGoal = this.comboMultipleCurrent
                this.comboMultiple = 1
            }
        }

        if (this.comboCountGoal === null) {
            this.comboCountGoal = this.comboCountCurrent
            this.comboCount = 1
        } else {
            if (this.comboCountGoal === this.comboCountCurrent) {
                this.comboCount = this.comboCount + 1
            } else {
                this.comboCountGoal = this.comboCountCurrent
                this.comboCount = 1
            }
        }

        this.quota = this.quota + this.point
        this.finishTurn()
    }

    handleLoseTurn() {
        this.comboMultipleGoal = null
        this.comboCountGoal = null
        this.comboMultiple = 0
        this.comboCount = 0
        this.finishTurn()
    }

    finishTurn() {
        this.turn = this.turn + 1
        this.timer = this.maxTimer
        this.sphere = this.pickNewRandomNumber()
        this.entriesActive = this.entriesActive.map((_) => false)
        this.bordersActive = this.bordersActive.map((_) => false)

        this.bordersAlive = this.bordersAlive.map((borderAlive: boolean, index: number) => {
            const isClicked =
                this.bordersActiveIndexesChanged.findIndex((indexChanged) => indexChanged === index) !== -1
            const isRevived = this.bordersDeadCount[index] >= 3
            return !(isClicked || (!borderAlive && !isRevived))
        })

        this.borders = this.borders.map((border: number, index: number) => {
            return this.bordersDeadCount[index] >= this.reviveAfterTurn ? this.pickNewRandomNumber() : border
        })

        this.bordersDeadCount = this.bordersDeadCount.map((count: number, index: number) => {
            return count >= this.reviveAfterTurn ? 0 : this.bordersAlive[index] ? count : count + 1
        })
        this.events.emit('finishTurn')
    }

    pickNewRandomNumber() {
        return Phaser.Math.RND.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9])
    }

    trackIndexesChanged(previous: Array<any>, current: Array<any>) {
        return Array.from(Array(previous.length).keys()).reduce((indexes: Array<number>, index: number) => {
            const previousCoin = previous[index]
            const currentCoin = current[index]
            return previousCoin !== currentCoin ? [...indexes, index] : indexes
        }, [])
    }

    get turn(): number {
        return this.get('turn') as number
    }

    get timer(): number {
        return this.get('timer') as number
    }

    get quota(): number {
        return this.get('quota') as number
    }

    get gameState(): GameState {
        return this.get('gameState') as GameState
    }

    get maxTurn(): number {
        return this.get('maxTurn') as number
    }

    get maxTimer(): number {
        return this.get('maxTimer') as number
    }

    get maxQuota(): number {
        return this.get('maxQuota') as number
    }

    get comboCount(): number {
        return this.get('comboCount') as number
    }

    get comboMultiple(): number {
        return this.get('comboMultiple') as number
    }

    get sphere(): number {
        return this.get('sphere') as number
    }

    get comboMultipleGoal(): number | null {
        return this.get('comboMultipleGoal') as number
    }

    get comboCountGoal(): number | null {
        return this.get('comboCountGoal') as number
    }

    get ratioCreateBorders(): number {
        return this.get('ratioCreateBorders') as number
    }

    get borders(): Array<number> {
        return this.get('borders') as Array<number>
    }

    get bordersAlive(): Array<boolean> {
        return this.get('bordersAlive') as Array<boolean>
    }

    get bordersActive(): Array<boolean> {
        return this.get('bordersActive') as Array<boolean>
    }

    get entries(): Array<number> {
        return this.get('entries') as Array<number>
    }

    get entriesActive(): Array<boolean> {
        return this.get('entriesActive') as Array<boolean>
    }

    set turn(value: number) {
        this.set('turn', value)
    }

    set timer(value: number) {
        this.set('timer', value)
    }

    set quota(value: number) {
        this.set('quota', value)
    }

    set gameState(value: GameState) {
        this.set('gameState', value)
    }

    set comboCount(value: number) {
        this.set('comboCount', value)
    }

    set comboMultiple(value: number) {
        this.set('comboMultiple', value)
    }

    set sphere(value: number) {
        this.set('sphere', value)
    }

    set maxTurn(value: number) {
        this.set('maxTurn', value)
    }

    set maxTimer(value: number) {
        this.set('maxTimer', value)
    }

    set maxQuota(value: number) {
        this.set('maxQuota', value)
    }

    set comboMultipleGoal(value: number | null) {
        this.set('comboMultipleGoal', value)
    }

    set comboCountGoal(value: number | null) {
        this.set('comboCountGoal', value)
    }

    set ratioCreateBorders(value: number) {
        this.set('ratioCreateBorders', value)
    }

    set borders(value: Array<number>) {
        this.set('borders', value)
    }

    set bordersAlive(currentBordersAlive: Array<boolean>) {
        this.bordersAliveIndexesChanged = this.trackIndexesChanged(
            [...this.bordersAlive],
            currentBordersAlive
        )
        this.set('bordersAlive', currentBordersAlive)
    }

    set bordersActive(currentBordersActive: Array<boolean>) {
        this.bordersActiveIndexesChanged = this.trackIndexesChanged(
            [...this.bordersActive],
            currentBordersActive
        )
        this.set('bordersActive', currentBordersActive)
    }

    set entries(value: Array<number>) {
        this.set('entries', value)
    }

    set entriesActive(curentEntriesActive: Array<boolean>) {
        this.entriesActiveIndexesChanged = this.trackIndexesChanged(
            [...this.entriesActive],
            curentEntriesActive
        )
        this.set('entriesActive', curentEntriesActive)
    }
}
