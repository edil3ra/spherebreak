import { Button, IButton } from './button'

export interface IButtonContainer extends IButton {
    setText(text: string): this
    setTextStyle(style: object): this
}

export class ButtonContainer extends Phaser.GameObjects.Container implements IButtonContainer {
    public button: IButton
    public text: Phaser.GameObjects.Text

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame: string,
        tint: number = 0xffffff
    ) {
        super(scene, x, y)

        this.button = new Button(scene, 0, 0, texture, frame, tint)
        this.text = scene.add.text(0, 0, 'Button', { color: 'black' }).setOrigin(0.5, 0.5)

        this.add(this.button)
        this.add(this.text)
    }

    setText(text: string) {
        this.text.text = text
        return this
    }

    setTextStyle(style: object) {
        this.text.setStyle(style)
        return this
    }

    setUpFrame(texture: string) {
        this.button.setUpFrame(texture)
        return this
    }

    setUpTint(tint: number) {
        this.button.setUpTint(tint)
        return this
    }

    setDownFrame(texture: string): this {
        this.button.setDownFrame(texture)
        return this
    }

    setDownTint(tint: number): this {
        this.button.setDownTint(tint)
        return this
    }

    setOverFrame(texture: string): this {
        this.button.setOverFrame(texture)
        return this
    }

    setOverTint(tint: number): this {
        this.button.setOverTint(tint)
        return this
    }

    setDisabledFrame(texture: string): this {
        this.button.setDisabledFrame(texture)
        return this
    }

    setDisabledTint(tint: number): this {
        this.button.setDisabledTint(tint)
        return this
    }

    setDisabled(disabled: boolean): this {
        this.setDisabled(disabled)
        return this
    }
}
