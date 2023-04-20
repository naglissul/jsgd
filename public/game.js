class Game {
    constructor(ctx) {
        this.ctx = ctx
        this.firebaseSignIn((user) => {
            const localPlayerId = user.uid
            if (localPlayerId) {
                const localPlayer = new LocalPlayer(localPlayerId, this)
                this.currentLevel = new MultiplayerRoom(localPlayer, this)
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

    gameLoop() {
        this.currentLevel.update()
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this.currentLevel.render(this.ctx)
        requestAnimationFrame(this.gameLoop.bind(this))
    }
}
