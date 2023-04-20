class Game {
    players = {}
    tiles = {}
    playersRef = firebase.database().ref('players')
    tilesRef = firebase.database().ref('tiles')

    constructor(ctx) {
        this.ctx = ctx
        this.firebaseSignIn((user) => {
            const localPlayerId = user.uid
            if (localPlayerId) {
                this.localPlayer = new LocalPlayer(localPlayerId, this)

                this.playersRef.on('value', (snapshot) => {
                    this.players = snapshot.val() || {}
                    this.localPlayer.x = this.players[localPlayerId].x
                    this.localPlayer.y = this.players[localPlayerId].y
                })

                this.tilesRef.on('value', (snapshot) => {
                    this.tiles = snapshot.val() || {}
                })

                this.initListeners()
                this.gameLoop()
            }
        })
    }

    firebaseSignIn(callback) {
        firebase
            .auth()
            .signInAnonymously()
            .catch((error) => {
                console.error('Anonymous sign in error: ', error)
            })
            .then(() => {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        console.log('Anonymous user is signed in.')
                        callback(user)
                    } else {
                        console.log('Anonymous user is signed out.')
                    }
                })
            })
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
            this.playersRef.off()
            this.localPlayer.ref.remove()
        })
    }

    gameLoop() {
        this.update()
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this.render(this.ctx)
        requestAnimationFrame(this.gameLoop.bind(this))
    }

    //FROM HERE - MAIN SPACE SPECIFICS

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
            'How to play?: Left, Right, Up, Space. v1.0.0. More: https://npw.lt/#/code',
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
