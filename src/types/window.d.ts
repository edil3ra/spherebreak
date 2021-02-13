export {}
declare global {
    interface Window {
        game: Phaser.Game,
        gdsdk: {
            showAd: Function
        },
        plugins: {
            NativeAudio: {
                preloadSimple: {
                    assetPath: string,
                    assetId: string,
                },
                play: {
                    assetId: string,
                },
            }
        }
    }
}


