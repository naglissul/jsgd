class Game {
    constructor(canvas, name) {
        this.canvas = canvas
        this.canvas.width = CANVAS_WIDTH
        this.canvas.height = CANVAS_HEIGHT

        this.ctx = this.canvas.getContext('2d')
        this.firebaseSignIn((user) => {
            const localPlayerId = user.uid
            if (localPlayerId) {
                const localPlayer = new LocalPlayer(localPlayerId, name, this)
                this.currentLevel = new PixelArtRoom(localPlayer, this)
                this.running = true
                this.gameLoop(performance.now())
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

    gameLoop(currentTime) {
        if (this.running) {
            const elapsedTime = currentTime - this.lastTime
            this.lastTime = currentTime

            this.currentLevel.update(elapsedTime * 60)
            this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            this.currentLevel.render(this.ctx)

            requestAnimationFrame((time) => this.gameLoop(time))
        }
    }
}
