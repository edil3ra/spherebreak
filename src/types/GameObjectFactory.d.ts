declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        buttonContainer(x: number, y: number, texture: string, frame: string, tint?: number)
        coin(
            x: number,
            y: number,
            width: number,
            height: number,
            type: CoinType,
            texture: string,
            frame: string,
            numero: number
        )
    }
}
