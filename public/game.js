class Game {
    players = {}
    tiles = {}

    constructor(ctx) {
        this.ctx = ctx
        const playerInfo = this.initFirebase()
        if (playerInfo) {
            this.playerId = playerInfo[0]
            this.playerRef = playerInfo[1]
            this.gameLoop()
        } else {
            console.log('Login failed')
        }
    }

    initFirebase() {
        let playerId
        let playerRef

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                playerId = user.uid
                playerRef = firebase.database().ref(`players/${playerId}`)
                playerRef.set({
                    id: user.uid,
                    name: createName(),
                    color: randomFromArray(playerColors),
                    x: Math.floor(Math.random() * (CANVAS_WIDTH - 30)),
                    y: Math.floor(Math.random() * (CANVAS_HEIGHT - 30)),
                })
                this.initListeners()
            } else {
                return null
            }
        })

        firebase
            .auth()
            .signInAnonymously()
            .catch((error) => {
                var errorCode = error.keyCode
                var errorMsg = error.message
                //...
                console.log(errorCode, errorMsg)
            })

        allPlayersRef.on('value', (snapshot) => {
            this.players = snapshot.val() || {}
        })

        allPlayersRef.on('child_added', (snapshot) => {
            this.players = snapshot.val() || {}
        })

        tilesRef.on('value', (snapshot) => {
            this.tiles = snapshot.val() || {}
        })

        tilesRef.on('child_added', (snapshot) => {
            this.tiles = snapshot.val() || {}
        })

        return [playerId, playerRef]
    }

    initListeners() {
        new KeyListener(
            'ArrowUp',
            () => (velY = -20),
            () => {}
        )
        new KeyListener(
            'ArrowLeft',
            () => (velX = -15),
            () => (velX = 0)
        )
        new KeyListener(
            'ArrowRight',
            () => (velX = 15),
            () => (velX = 0)
        )
        new KeyListener(
            'Space',
            () => {
                tilesRef.push({
                    x: players[playerId].x - 30,
                    y: players[playerId].y,
                })
            },
            () => {}
        )

        addEventListener('visibilitychange', () => {
            playerRef.remove()
        })
    }

    gameLoop() {
        this.update()
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.render(this.ctx)
        requestAnimationFrame(gameLoop)
    }

    update() {
        playerUpdate(playerId)
    }

    render(ctx) {
        backgroundRender(ctx)

        Object.keys(players).forEach((key) => {
            playerRender(key, ctx)
        })

        Object.keys(tiles).forEach((key) => {
            tileRender(key, ctx)
        })
    }
}
