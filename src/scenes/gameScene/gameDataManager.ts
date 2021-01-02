import { GameScene } from '~/scenes/gameScene'

export class GameDataManager extends Phaser.Data.DataManager {
    public coinsActiveIndexesChanged: Array<number>
    public coinsAliveIndexesChanged: Array<number>
    public entriesActiveIndexesChanged: Array<number>

    constructor(scene: GameScene) {
        super(scene)

        this.turn = 0
        this.timer = 0
        this.quota = 0
        this.maxTurn = 0
        this.maxQuota = 0
        this.quota = 0
        this.comboCount = 0
        this.comboMultiple = 0
        this.comboMultipleGoal = null
        this.comboCountGoal = null
        this.ratioCreateCoins = 0
        this.sphere = 0
        this.coins = new Array(12).fill(0)
        // this.coinsAlive = new Array(12).fill(false)
        this.set('coinsAlive', new Array(12).fill(false))
        this.set('coinsActive', new Array(12).fill(false))
        this.entries = new Array(4).fill(0)
        this.set('entriesActive', new Array(4).fill(false))
        this.coinsActiveIndexesChanged = []
        this.coinsAliveIndexesChanged = []
        this.entriesActiveIndexesChanged = []
    }

    get total(): number {
        const activeCoins = this.coins.filter((_coin: number, index: number) => this.coinsActive[index])
        const activeEntries = this.entries.filter((_coin: number, index: number) => this.entriesActive[index])

        return (
            activeCoins.reduce((previous: number, current: number) => previous + current, 0) +
            activeEntries.reduce((previous: number, current: number) => previous + current, 0)
        )
    }

    get comboCountCurrent(): number {
        const activeCoins = this.coins.filter((_coin: number, index: number) => this.coinsActive[index])
        const activeEntries = this.entries.filter((_coin: number, index: number) => this.entriesActive[index])
        return activeCoins.length + activeEntries.length
    }

    get comboMultipleCurrent(): number {
        return Math.floor(this.total / this.sphere)
    }

    comboPointByKey(combo: number): number {
        if (combo === 0) {
            return 0
        } else {
            return Math.pow(2, combo - 1)
        }
    }

    get comboCountPoint(): number {
        return this.comboPointByKey(this.comboCount)
    }

    get comboMultiplePoint(): number {
        return this.comboPointByKey(this.comboMultiple)
    }

    get point(): number {
        return 1 + this.comboCountPoint + this.comboMultiplePoint
    }

    isWinTurn() {
        return this.total % this.sphere === 0
    }

    isAllSphereActive() {
        const hasNoCoins = this.coinsActive.every((coinActive) => coinActive)
        const hasNoEntries = this.entriesActive.every((entryActive) => entryActive)
        return hasNoCoins && hasNoEntries
    }

    handleWinTurn() {
        if (this.comboMultipleGoal === null) {
            this.comboMultipleGoal = this.comboMultipleCurrent
        } else {
            if (this.comboMultipleGoal === this.comboMultipleCurrent) {
                this.comboMultiple = this.comboMultiple + 1
            } else {
                this.comboMultipleGoal = null
                this.comboMultiple = 0
            }
        }

        if (this.comboCountGoal === null) {
            this.comboCountGoal = this.comboCountCurrent
        } else {
            if (this.comboCountGoal === this.comboCountCurrent) {
                this.comboMultiple = this.comboMultiple + 1
            } else {
                this.comboCountGoal = null
                this.comboMultiple = 0
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
        this.sphere = this.pickNewRandomNumber()
        this.entriesActive = this.entriesActive.map((_) => false)
    }

    pickNewRandomNumber() {
        return Phaser.Math.RND.integerInRange(1, 9)
    }

    setCoinsAfterTurn() {
        for (let index = 0; index < 12; index++) {
            const isAlive = this.coinsAlive[index]
            if (!isAlive) {
                this.coins[index] = this.pickNewRandomNumber()
                this.coinsActive[index] = false
                this.coinsAlive[index] = true
            }
        }
    }

    trackIndexesChanged(previous: Array<any>, current: Array<any>) {
        return Array.from(Array(previous.length).keys()).reduce((indexes: Array<number>, index: number) => {
            const previousCoinAlive = previous[index]
            const currentCoinAlive = current[index]
            return previousCoinAlive !== currentCoinAlive ? [...indexes, index] : indexes
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

    get ratioCreateCoins(): number {
        return this.get('ratioCreateCoins') as number
    }

    get coins(): Array<number> {
        return this.get('coins') as Array<number>
    }

    get coinsAlive(): Array<boolean> {
        return this.get('coinsAlive') as Array<boolean>
    }

    get coinsActive(): Array<boolean> {
        return this.get('coinsActive') as Array<boolean>
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

    set ratioCreateCoins(value: number) {
        this.set('ratioCreateCoins', value)
    }

    set coins(value: Array<number>) {
        this.set('coins', value)
    }

    set coinsAlive(currentCoinsAlive: Array<boolean>) {
        this.coinsAliveIndexesChanged = this.trackIndexesChanged([...this.coinsAlive], currentCoinsAlive)
        this.set('coinsAlive', currentCoinsAlive)
    }

    set coinsActive(currentCoinsActive: Array<boolean>) {
        this.coinsActiveIndexesChanged = this.trackIndexesChanged([...this.coinsActive], currentCoinsActive)
        this.set('coinsActive', currentCoinsActive)
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
