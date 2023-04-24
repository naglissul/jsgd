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
        this.keyA = new Image()
        this.keyA.src = 'assets/a.png'
        this.keyS = new Image()
        this.keyS.src = 'assets/s.png'
        this.keyD = new Image()
        this.keyD.src = 'assets/d.png'
        this.keyEsc = new Image()
        this.keyEsc.src = 'assets/esc.png'
        this.keySpace = new Image()
        this.keySpace.src = 'assets/space.png'
        this.keyLeft = new Image()
        this.keyLeft.src = 'assets/left.png'
        this.keyRight = new Image()
        this.keyRight.src = 'assets/right.png'
        this.keyUp = new Image()
        this.keyUp.src = 'assets/up.png'
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
                if (y >= 0) {
                    this.tilesRef
                        .child(`${x}${y}`)
                        .once('value', (snapshot) => {
                            if (snapshot.exists()) {
                                if (WINNING_TILES.hasOwnProperty(`${x}${y}`)) {
                                    this.tilesRef.child(`${x}${y}`).update({
                                        x: x,
                                        y: y,
                                        color: COLORS[
                                            this.localPlayer.colorNumber
                                        ],
                                    })
                                } else {
                                    this.tilesRef.child(`${x}${y}`).remove()
                                }
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
            'Escape',
            () => {
                this.tilesRef.remove()
                this.won = false
            },
            () => {}
        )
        new KeyListener(
            'KeyD',
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
            'KeyA',
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
            'KeyS',
            () => {
                this.showTiles = false
            },
            () => {
                this.showTiles = true
            }
        )

        addEventListener('visibilitychange', () => {
            this.game.running = false
            this.playersRef.off()
            this.deletingKey.unbind()
            this.localPlayer.ref.remove()
            this.game.canvas.style.filter = 'blur(5px)'
            const sorry = document.createElement('h1')
            sorry.textContent =
                'Sorry, the focus was gone. You need to refresh the page...'
            sorry.style.position = 'absolute'
            sorry.style.display = 'block'
            sorry.style.margin = 'auto'
            sorry.style.textAlign = 'center'
            document.body.appendChild(sorry)
        })
    }

    update() {
        if (this.localPlayer) {
            this.localPlayer.update()
        }
    }

    render(ctx) {
        this.backgroundRender(ctx)
        if (this.showTiles) {
            this.tilesRender(ctx)
        }
        this.playersRender(ctx)

        if (this.won) {
            ctx.font = '30px Courier bold'
            ctx.fillStyle = 'green'
            ctx.fillText('YOU DID IT! YOU FINALLY WON! CONGRATS!', 650, 200)
            ctx.font = '15px Courier bold'
            ctx.fillText("press 'Esc' to restart", 1000, 250)
        }
    }

    backgroundRender(ctx) {
        //Picture
        ctx.drawImage(this.pixelArtBackground, 300, 0)

        ctx.drawImage(this.keyLeft, 20, 100, 50, 50)
        ctx.drawImage(this.keyUp, 70, 50, 50, 50)
        ctx.drawImage(this.keyRight, 120, 100, 50, 50)
        ctx.drawImage(this.keySpace, 20, 200, 150, 50)
        ctx.drawImage(this.keyA, 20, 300, 50, 50)
        ctx.drawImage(this.keyD, 120, 300, 50, 50)
        ctx.drawImage(this.keyS, 20, 400, 50, 50)
        ctx.drawImage(this.keyEsc, 20, 500, 50, 50)

        //Text
        ctx.font = '15px Arial'
        ctx.fillStyle = 'black'
        ctx.fillText('JSGD v1.1.1      More: https://npw.lt/#/code', 200, 20)
        ctx.font = '30px Arial'
        ctx.fillText(
            `${this.countEqual(WINNING_TILES, this.tiles)}/${
                Object.keys(WINNING_TILES).length
            }`,
            645,
            100
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
