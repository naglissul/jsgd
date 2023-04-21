class PixelArtRoom {
    players = {}
    tiles = {}
    playersRef = firebase.database().ref('players')
    tilesRef = firebase.database().ref('tiles')

    constructor(localPlayer, game) {
        this.localPlayer = localPlayer
        this.game = game
        this.won = false

        this.playersRef.on('value', (snapshot) => {
            this.players = snapshot.val() || {}
            localPlayer.x = this.players[localPlayer.id].x
            localPlayer.y = this.players[localPlayer.id].y
        })

        this.tilesRef.on('value', (snapshot) => {
            this.tiles = snapshot.val() || {}
            if (this.shallowEqual(this.tiles, WINNING_TILES)) {
                this.won = true
            }
        })

        this.initListeners()
        this.pixelArtBackground = new Image()
        this.pixelArtBackground.src = 'assets/mario.png'
    }

    initListeners() {
        new KeyListener(
            'ArrowUp',
            () => (this.localPlayer.velY = -10),
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
                let x = Math.floor((this.localPlayer.x + 15) / 30) * 30
                let y = Math.floor(this.localPlayer.y / 30 - 1) * 30
                this.tilesRef.child(`${x}${y}`).once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        this.tilesRef.child(`${x}${y}`).update({
                            x: x,
                            y: y,
                            color: COLORS[this.localPlayer.colorNumber],
                        })
                    } else {
                        this.tilesRef.child(`${x}${y}`).set({
                            x: x,
                            y: y,
                            color: COLORS[this.localPlayer.colorNumber],
                        })
                    }
                })
            },
            () => {}
        )
        this.deletingListener = new KeyListener(
            'Delete',
            () => {
                this.tilesRef.remove()
                this.won = false
            },
            () => {}
        )
        new KeyListener(
            'ControlRight',
            () => {
                this.localPlayer.colorNumber =
                    (this.localPlayer.colorNumber + 1) % COLORS.length
                this.localPlayer.ref.update({
                    color: COLORS[this.localPlayer.colorNumber],
                })
            },
            () => {}
        )
        new KeyListener(
            'ControlLeft',
            () => {
                this.localPlayer.colorNumber =
                    (this.localPlayer.colorNumber - 1 + COLORS.length) %
                    COLORS.length
                this.localPlayer.ref.update({
                    color: COLORS[this.localPlayer.colorNumber],
                })
            },
            () => {}
        )

        addEventListener('visibilitychange', () => {
            this.game.running = false
            this.deletingListener.unbind()
            this.playersRef.off()
            this.localPlayer.ref.remove()
            this.game.canvas.style.filter = 'blur(5px)'
        })
    }

    update() {
        if (this.localPlayer) {
            this.localPlayer.update()
        }
    }

    render(ctx) {
        this.backgroundRender(ctx)
        this.tilesRender(ctx)
        this.playersRender(ctx)

        if (this.won) {
            ctx.font = '30px Courier bold'
            ctx.fillStyle = 'green'
            ctx.fillText('YOU DID IT! YOU FINALLY WON! CONGRATS!', 650, 200)
            ctx.font = '15px Courier bold'
            ctx.fillText("press 'delete' to restart", 1000, 250)
        }
    }

    backgroundRender(ctx) {
        //Picture
        ctx.drawImage(this.pixelArtBackground, 300, 0)
        //Text
        ctx.font = '15px Arial'
        ctx.fillStyle = 'black'
        ctx.fillText(
            'How to play?: Left, Right, Up, Space, Delete, ControlRight, ControlLeft. v1.0.0. More: https://npw.lt/#/code',
            400,
            20
        )
    }

    playersRender(ctx) {
        Object.keys(this.players).forEach((key) => {
            ctx.fillStyle = this.players[key].color
            ctx.fillRect(this.players[key].x, this.players[key].y, 30, 30)
            ctx.fillStyle = 'black'
            ctx.textAlign = 'center'
            ctx.font = '15px Arial'
            ctx.fillText(
                this.players[key].name,
                this.players[key].x + 15,
                this.players[key].y - 3
            )

            //Shadow
            ctx.strokeStyle = 'CadetBlue'
            let x = Math.floor((this.localPlayer.x + 15) / 30) * 30
            let y = Math.floor(this.localPlayer.y / 30 - 1) * 30
            ctx.strokeRect(x, y, 30, 30)
        })
    }

    tilesRender(ctx) {
        Object.keys(this.tiles).forEach((key) => {
            ctx.fillStyle = this.tiles[key].color
            ctx.fillRect(this.tiles[key].x, this.tiles[key].y, 30, 30)
        })
    }

    //Tiles object comparison
    shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1)
        const keys2 = Object.keys(object2)
        if (keys1.length !== keys2.length) {
            return false
        }
        for (let key of keys1) {
            if (object1[key].color !== object2[key].color) {
                return false
            }
        }
        return true
    }
}
