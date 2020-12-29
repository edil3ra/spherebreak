window["GD_OPTIONS"] = {
    "gameId": '362e7a035b4d4875931051da2d62ddc3',
    "onEvent": function(event) {
        switch (event.name) {
            case "SDK_GAME_START":
            window.game.scene.pause()
                break;
            case "SDK_GAME_PAUSE":
            window.game.scene.pause()
                break;
            case "SDK_GDPR_TRACKING":
                // this event is triggered when your user doesn't want to be tracked
                break;
            case "SDK_GDPR_TARGETING":
                // this event is triggered when your user doesn't want personalised targeting of ads and such
                break;
        }
    },
};

export function initGameDistribution() {
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://html5.api.gamedistribution.com/main.min.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'gamedistribution-jssdk'));
}



export function mockGameDistribution () {
    window.gdsdk = {}
    window.gdsdk.showAd = () => {}
}
