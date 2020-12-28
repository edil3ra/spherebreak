declare namespace Phaser.GameObjects
{
	interface GameObjectFactory
	{
		buttonContainer(x: number, y: number, texture: string, tint?: number): IButtonContainer
	}
}
