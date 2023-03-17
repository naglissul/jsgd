const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

//console.log(c)
//console.log(firebase)

class Player {
    constructor() {
        this.position = {
            x: Math.floor(Math.random() * (innerWidth - 30)),
            y: Math.floor(Math.random() * (innerHeight - 30)),
        }
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        this.velocity.y += 1

        if (this.position.y > innerHeight - this.height) {
            this.velocity.y = -this.velocity.y + 15
            this.position.y = innerHeight - this.height
        }
        if (this.position.x > innerWidth - this.width) {
            this.position.x = innerWidth - this.width
        }
        if (this.position.x < 0) {
            this.position.x = 0
        }
        this.draw()
    }
}

const player = new Player()
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
}

//LISTENERS--------------------------------------------------
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 32: //space
            player.velocity.y = -15
            break
        case 39: //right
            player.velocity.x = 10
            break
        case 37: //left
            player.velocity.x = -10
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 39: //right
            player.velocity.x = 0
            break
        case 37: //left
            player.velocity.x = 0
    }
})

//INITIALIZATION------------------------------------------------
function initGame() {
    const allPlayersRef = firebase.database().ref('players')
    const allCoinsRef = firebase.database().ref('coins')

    //whenever playersref changes LISTENER
    allPlayersRef.on('value', (snapshot) => {
        console.log('changes made:')
        console.log(snapshot.val())
    })

    //new node added to the tree LISTENER (if new - from 0)
    allPlayersRef.on('child_added', (snapshot) => {
        console.log('another guy: ')
        console.log(snapshot.val())
    })
}

//MAIN FUNCTION--------------------------------------------------
;(function () {
    let playerId
    let playerRef

    firebase.auth().onAuthStateChanged((user) => {
        console.log('me: ')
        console.log(user)

        if (user) {
            playerId = user.uid
            playerRef = firebase.database().ref(`players/${playerId}`)

            playerRef.set({
                id: playerId,
                name: createName(),
                color: randomFromArray(playerColors),
                x: 100,
                y: 100,
                coins: 0,
            })
        } else {
        }

        firebase
            .auth()
            .signInAnonymously()
            .catch((error) => {
                var errorCode = error.keyCode
                var errorMsg = error.message
                //...
                console.log(errorCode, errorMsg)
            })
    })
})()
