export {}
declare global {
    interface Window {
        game: Phaser.Game;
        gdsdk: {
            showAd: Function
        }
    }
}


