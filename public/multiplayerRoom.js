class MultiplayerRoom {
    players = {}
    tiles = {}
    playersRef = firebase.database().ref('players')
    tilesRef = firebase.database().ref('tiles')

    constructor(localPlayer, game) {
        this.localPlayer = localPlayer
        this.game = game

        this.playersRef.on('value', (snapshot) => {
            this.players = snapshot.val() || {}
            localPlayer.x = this.players[localPlayer.id].x
            localPlayer.y = this.players[localPlayer.id].y
        })

        this.tilesRef.on('value', (snapshot) => {
            this.tiles = snapshot.val() || {}
        })

        this.initListeners()
    }

    initListeners() {
        new KeyListener(
            'ArrowUp',
            () => (this.localPlayer.velY = -20),
            () => {}
        )
        new KeyListener(
            'ArrowLeft',
            () => (this.localPlayer.velX = -10),
            () => (this.localPlayer.velX = 0)
        )
        new KeyListener(
            'ArrowRight',
            () => (this.localPlayer.velX = 10),
            () => (this.localPlayer.velX = 0)
        )
        new KeyListener(
            'Space',
            () => {
                this.tilesRef.push({
                    x: this.localPlayer.x,
                    y: this.localPlayer.y - 30,
                })
            },
            () => {}
        )

        addEventListener('visibilitychange', () => {
            this.game.running = false
            this.playersRef.off()
            this.localPlayer.ref.remove()
        })
    }

    update() {
        if (this.localPlayer) {
            this.localPlayer.update()
        }
    }

    render(ctx) {
        this.backgroundRender(ctx)
        this.playersRender(ctx)
        this.tilesRender(ctx)
    }

    backgroundRender(ctx) {
        ctx.font = '15px Arial'
        ctx.fillStyle = 'red'
        ctx.fillText(
            'How to play?: Left, Right, Up, Space. v0.2.1. More: https://npw.lt/#/code',
            250,
            100
        )
    }

    playersRender(ctx) {
        Object.keys(this.players).forEach((key) => {
            ctx.fillStyle = this.players[key].color
            ctx.fillRect(this.players[key].x, this.players[key].y, 30, 30)
            ctx.fillStyle = 'black'
            ctx.textAlign = 'center'
            ctx.font = '10px Arial'
            ctx.fillText(
                this.players[key].name,
                this.players[key].x + 15,
                this.players[key].y - 3
            )
        })
    }

    tilesRender(ctx) {
        Object.keys(this.tiles).forEach((key) => {
            ctx.fillStyle = 'black'
            ctx.fillRect(this.tiles[key].x, this.tiles[key].y, 30, 30)
        })
    }
}
