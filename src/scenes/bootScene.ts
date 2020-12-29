export class BootScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics
    private progressBar: Phaser.GameObjects.Graphics
    constructor() {
        super({ key: 'boot' })
    }


    preload(): void {
        this.cameras.main.setBackgroundColor(0x000000)
        this.createLoadingGraphics()

        this.load.on(
            'progress',
            (value: number) => {
                this.progressBar.clear()
                this.progressBar.fillStyle(0x00ff00, 1)
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                )
            },
            this
        )

        // delete bar graphics, when loading complete
        this.load.on(
            'complete',
            () => {
                this.progressBar.destroy()
                this.loadingBar.destroy()
                this.scene.start('menu')
            },
            
        )

        
        this.load.image('menuBackground', 'assets/images/background-main.jpg')
        this.load.image('menuButton', 'assets/images/button_rectangleWood.png')
        this.load.image('b1', 'assets/images/bannerHanging.png')
        this.load.image('b2', 'assets/images/bannerModern.png')
        this.load.image('b3', 'assets/images/bannerScroll.png')
        this.load.webfont('Open Sans', 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap')
        this.load.webfont('Play', 'https://fonts.googleapis.com/css2?family=Play&display=swap')
    }

    private createLoadingGraphics(): void {
        this.loadingBar = this.add.graphics()
        this.loadingBar.fillStyle(0x00ff00, 1)
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        )
        this.progressBar = this.add.graphics()
    }
    


}
