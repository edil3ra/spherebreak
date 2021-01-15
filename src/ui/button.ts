const WHITE = 0xffffff

export interface IButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform {
    setUpFrame(texture: string): this
    setUpTint(tint: number): this
    setDownFrame(texture: string): this
    setDownTint(tint: number): this
    setOverFrame(texture: string): this
    setOverTint(tint: number): this
    setDisabledFrame(texture: string): this
    setDisabledTint(tint: number): this
    setDisabled(disabled: boolean): this
}

export class Button extends Phaser.GameObjects.Image implements IButton {
    private upFrame: string
    private upTint: number
    private downFrame: string
    private downTint: number
    private overFrame: string
    private overTint: number
    private disabledFrame: string
    private disabledTint: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame: string,
        tint: number = WHITE
    ) {
        super(scene, x, y, texture, frame)
        this.setTint(tint)

        this.upFrame = frame
        this.upTint = tint
        this.downFrame = frame
        this.downTint = tint
        this.overFrame = frame
        this.overTint = tint
        this.disabledFrame = frame
        this.disabledTint = tint

        this.setInteractive({ cursor: 'pointer' })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleUp, this)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handleOut, this)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleDown, this)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.handleOver, this)
    }

    setUpFrame(texture: string) {
        this.upFrame = texture
        return this
    }

    setUpTint(tint: number) {
        this.upTint = tint
        return this
    }

    setDownFrame(texture: string) {
        this.downFrame = texture
        return this
    }

    setDownTint(tint: number) {
        this.downTint = tint
        return this
    }

    setOverFrame(texture: string) {
        this.overFrame = texture
        return this
    }

    setOverTint(tint: number) {
        this.overTint = tint
        return this
    }

    setDisabledFrame(texture: string) {
        this.disabledFrame = texture
        return this
    }

    setDisabledTint(tint: number) {
        this.disabledTint = tint
        return this
    }

    setDisabled(disabled: boolean) {
        if (disabled) {
            this.setFrame(this.disabledFrame)
            this.setTint(this.disabledTint)
            this.disableInteractive()
            return this
        }

        this.setFrame(this.upFrame)
        this.setTint(this.disabledTint)
        this.setInteractive()

        return this
    }

    private handleUp(pointer: Phaser.Input.Pointer) {
        this.handleOver(pointer)
    }

    private handleOut(_pointer: Phaser.Input.Pointer) {
        this.setFrame(this.upFrame)
        this.setTint(this.upTint)
    }

    private handleDown(_pointer: Phaser.Input.Pointer) {
        this.setFrame(this.downFrame)
        this.setTint(this.downTint)
    }

    private handleOver(_pointer: Phaser.Input.Pointer) {
        this.setFrame(this.overFrame)
        this.setTint(this.overTint)
    }
}
