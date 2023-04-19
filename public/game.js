class Game {
    players = {}
    tiles = {}
    allPlayersRef = firebase.database().ref('players')
    tilesRef = firebase.database().ref('tiles')

    constructor(ctx) {
        this.ctx = ctx
        const playerInfo = this.initFirebase()
        this.playerId = playerInfo[0]
        this.playerRef = playerInfo[1]

        new Player(this)
        this.gameLoop()
    }

    initFirebase() {
        let playerId
        let playerRef

        firebase
            .auth()
            .signInAnonymously()
            .catch((error) => {
                console.error(
                    'Anonymous sing-in error: ',
                    error.keyCode,
                    error.message
                )
            })

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('Anonymous user is signed in.')

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
                console.log('Anonymous user is signed out.')
            }
        })

        this.allPlayersRef.on('value', (snapshot) => {
            this.players = snapshot.val() || {}
        })

        this.allPlayersRef.on('child_added', (snapshot) => {
            this.players = snapshot.val() || {}
        })

        this.tilesRef.on('value', (snapshot) => {
            this.tiles = snapshot.val() || {}
        })

        this.tilesRef.on('child_added', (snapshot) => {
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

    //FROM HERE - FIRST LEVEL SPECIFICS

    update() {
        playerUpdate(playerId)
    }

    render(ctx) {
        this.backgroundRender(ctx)
        this.playersRender(ctx)
        this.tilesRender(ctx)
    }

    backgroundRender(ctx) {
        ctx.font = '30px Arial'
        ctx.fillStyle = 'red'
        ctx.fillText('How to play?: Left, Right, Up, Space. v1.0.0', 500, 100)
        ctx.font = '10px Arial'
    }

    playersRender(ctx) {
        Object.keys(this.players).forEach((key) => {
            ctx.fillStyle = players[key].color
            ctx.fillRect(players[key].x, players[key].y, 30, 30)
            ctx.fillStyle = 'black'
            ctx.textAlign = 'center'
            ctx.fillText(
                players[key].name,
                players[key].x + 15,
                players[key].y - 3
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
