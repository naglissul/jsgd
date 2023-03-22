const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

let playerRef
let playerId
const allPlayersRef = firebase.database().ref('players')
const allBulletsRef = firebase.database().ref('bullets')
let players = {}
let bullets = {}
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
        players = snapshot.val() || {}
    })

    allPlayersRef.on('child_added', (snapshot) => {
        players = snapshot.val() || {}
    })

    allBulletsRef.on('value', (snapshot) => {
        bullets = snapshot.val() || {}
    })

    allBulletsRef.on('child_added', (snapshot) => {
        bullets = snapshot.val() || {}
    })

    new KeyListener(
        'Space',
        () => jump(),
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
        'KeyA',
        () =>
            (bullets = {
                ...bullets,
                [playerId + parseInt(Math.random() * 100)]: {
                    x: players[playerId].x + 30,
                    y: players[playerId].y + 10,
                },
            }),
        () => {}
    )

    addEventListener('visibilitychange', () => {
        playerRef.remove()
        alert("Dude, don't change the visibility...")
    })
}

//PLAYER ME------------------------------------------
function animate() {
    requestAnimationFrame(animate)
    if (players[playerId]) {
        velY += 1
        let x = players[playerId].x
        let y = players[playerId].y
        x += velX
        y += velY

        if (y > canvas.height - 30) {
            velY = -velY + 5
            y = canvas.height - 30
        }
        if (x > canvas.width - 30) {
            x = canvas.width - 30
        }
        if (x < 0) {
            x = 0
        }

        Object.keys(bullets)
            .filter((id) => id.startsWith(playerId))
            .forEach((key) => {
                bullets[key].x += 5
                if (bullets[key].x > canvas.width) {
                    delete bullets[key]
                }
            })
        allBulletsRef.set(bullets)

        //RENDER
        c.clearRect(0, 0, canvas.width, canvas.height)

        //DRAW TEXT
        c.font = '30px Arial'
        c.fillStyle = 'red'
        c.fillText('Left, Right, Space, A', 500, 100)
        c.font = '10px Arial'

        //DRAW PLAYERS
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

        //DRAW BULLETS
        c.fillStyle = 'black'
        Object.keys(bullets).forEach((key) => {
            c.fillRect(bullets[key].x, bullets[key].y, 10, 10)
        })

        playerRef.update({ x: x, y: y })
    }
}

animate()
