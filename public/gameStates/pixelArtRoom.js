class PixelArtRoom {
    players = {}
    tiles = {}
    playersRef = firebase.database().ref('players')
    tilesRef = firebase.database().ref('tiles')

    constructor(localPlayer, game) {
        this.localPlayer = localPlayer
        this.game = game
        this.won = false
        this.showTiles = true
        this.framei = 0

        this.playersRef.on('value', (snapshot) => {
            this.players = snapshot.val() || {}

            localPlayer.x = this.players[localPlayer.id]?.x
            localPlayer.y = this.players[localPlayer.id]?.y
        })

        this.tilesRef.on('value', (snapshot) => {
            this.tiles = snapshot.val() || {}
            if (this.shallowEqual(this.tiles, WINNING_TILES)) {
                this.won = true
            }
        })

        let serverRef = firebase.database().ref('server')
        serverRef.on('value', (snapshot) => {
            this.isServerRunning = snapshot.val().isRunning === 'true'
        })

        this.initListeners()
        this.pixelArtBackground = new Image()
        this.pixelArtBackground.src = 'assets/mario.png'
        this.keys = new Image()
        this.keys.src = 'assets/keys.png'
        this.wingif = new Image()
        this.wingif.src = 'assets/winsprtsheet.png'
    }

    initListeners() {
        new KeyListener(
            ['ArrowDown', 'KeyJ'],
            () => {
                this.localPlayer.midair = true
            },
            () => {
                this.localPlayer.midair = false
            }
        )
        new KeyListener(
            ['ArrowUp', 'KeyK'],
            () => (this.localPlayer.velY = -10),
            () => {}
        )
        new KeyListener(
            ['ArrowLeft', 'KeyH'],
            () => (this.localPlayer.velX = -10),
            () => (this.localPlayer.velX = 0)
        )
        new KeyListener(
            ['ArrowRight', 'KeyL'],
            () => (this.localPlayer.velX = 10),
            () => (this.localPlayer.velX = 0)
        )
        new KeyListener(
            ['Space'],
            () => {
                let x = Math.floor((this.localPlayer.x + 15) / 30) * 30
                let y = Math.floor(this.localPlayer.y / 30 - 1) * 30
                if (y >= 0) {
                    this.tilesRef
                        .child(`${x}${y}`)
                        .once('value', (snapshot) => {
                            if (snapshot.exists()) {
                                this.tilesRef.child(`${x}${y}`).remove()
                            } else {
                                this.tilesRef.child(`${x}${y}`).set({
                                    x: x,
                                    y: y,
                                    color: COLORS[this.localPlayer.colorNumber],
                                })
                            }
                        })
                }
            },
            () => {}
        )
        this.deletingKey = new KeyListener(
            ['Escape'],
            () => {
                this.tilesRef.remove()
                this.won = false
                this.framei = 0
            },
            () => {}
        )
        new KeyListener(
            ['KeyD'],
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
            ['KeyA'],
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
        new KeyListener(
            ['KeyS'],
            () => {
                this.showTiles = false
            },
            () => {
                this.showTiles = true
            }
        )

        addEventListener('visibilitychange', () => {
            this.localPlayer.ref.remove()
        })
    }

    update(elapsedTime) {
        if (this.localPlayer) {
            if (this.players[this.localPlayer.id]?.name) {
                this.localPlayer.update(elapsedTime)
            } else {
                this.localPlayer = new LocalPlayer(
                    this.game.localPlayerId,
                    this.game.playerName,
                    this.game
                )
            }

            if (this.framei == 1) this.tilesRef.remove()
            if (this.framei < 245 && this.won) this.framei += 1
        }
    }

    render(ctx) {
        this.backgroundRender(ctx)
        if (this.won) {
            ctx.drawImage(
                this.wingif,
                Math.floor(this.framei / 5) * 660,
                0,
                660,
                660,
                330,
                -300,
                960,
                960
            )
        }
        if (this.showTiles) {
            this.tilesRender(ctx)
        }

        this.playersRender(ctx)

        if (this.won) {
            ctx.font = '30px Courier bold'
            ctx.fillStyle = 'green'
            ctx.fillText('FINALLY! Thx for setting Mario free :)', 650, 200)
            ctx.font = '15px Courier bold'
            ctx.fillText("press 'Esc' to restart", 1000, 250)
        }
    }

    backgroundRender(ctx) {
        //Picture
        if (!this.won) {
            ctx.drawImage(this.pixelArtBackground, 300, 0)
        }

        ctx.drawImage(this.keys, 20, 20, 420, 600)

        //Text
        ctx.font = '15px Arial'
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.fillText('JSGD v1.3.0', 1150, 30)
        ctx.textAlign = 'left'
        ctx.fillText('Player is refreshed every 60s when frozen', 1000, 60)
        ctx.fillStyle = this.isServerRunning ? 'green' : 'red'
        ctx.textAlign = 'center'

        ctx.fillText(
            `Server is: ${this.isServerRunning ? 'running' : 'not running'}`,
            1150,
            90
        )
        ctx.fillStyle = 'black'
        ctx.fillText('More: https://npw.lt/#/code', 1150, 120)
        ctx.font = '30px Arial'
        if (!this.won) {
            ctx.fillText(
                `${this.countEqual(WINNING_TILES, this.tiles)}/${
                    Object.keys(WINNING_TILES).length
                }`,
                645,
                100
            )
        }
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

    countEqual(object1, object2) {
        let count = 0
        const keys1 = Object.keys(object1)
        for (let key of keys1) {
            if (object2.hasOwnProperty(key)) {
                if (object1[key].color === object2[key].color) {
                    count = count + 1
                }
            }
        }
        return count
    }
}
