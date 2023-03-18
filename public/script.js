const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

let playerRef
let playerId
const allPlayersRef = firebase.database().ref('players')
let players = []
let velY = 0
let velX = 0

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        playerId = user.uid
        playerRef = firebase.database().ref(`players/${playerId}`)
        playerRef.set({
            id: user.uid,
            name: createName(),
            color: randomFromArray(playerColors),
            x: Math.floor(Math.random() * (innerWidth - 30)),
            y: Math.floor(Math.random() * (innerHeight - 30)),
        })
        initListeners()
    } else {
        //logged out
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
//----------------------------------------------------
function jump() {
    velY = -20
}

//LISTENERS
function initListeners() {
    allPlayersRef.on('value', (snapshot) => {
        c.clearRect(0, 0, canvas.width, canvas.height)

        c.font = '30px Arial'
        c.fillStyle = 'red'
        c.fillText('Left, Right, Space, A', 500, 100)
        c.font = '10px Arial'
        //draw all players
        players = snapshot.val() || {}
        Object.keys(players).forEach((key) => {
            c.fillStyle = players[key].color
            c.fillRect(players[key].x, players[key].y, 30, 30)
            c.fillStyle = 'black'
            c.textAlign = 'center'
            c.fillText(
                players[key].name,
                players[key].x + 15,
                players[key].y - 3
            )
        })
    })

    allPlayersRef.on('child_added', (snapshot) => {
        players = snapshot.val() || {}
    })

    new KeyListener('Space', () => jump())
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
        'KeyA',
        () =>
            (players = {
                ...players,
                [playerId + parseInt(Math.random() * 100)]: {
                    x: players[playerId].x,
                    y: players[playerId].y,
                    color: 'black',
                    name: '',
                },
            }),
        () => {}
    )
}

//PLAYER ME------------------------------------------
function animate() {
    requestAnimationFrame(animate)
    velY += 1
    let x = players[playerId].x
    let y = players[playerId].y
    x += velX
    y += velY

    if (y > innerHeight - 30) {
        velY = -velY + 5
        y = innerHeight - 30
    }
    if (x > innerWidth - 30) {
        x = innerWidth - 30
    }
    if (x < 0) {
        x = 0
    }

    players[playerId].x = x
    players[playerId].y = y

    allPlayersRef.set(players)
}
animate()
