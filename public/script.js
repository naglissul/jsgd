const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

//console.log(c)
//console.log(firebase)

let playerRef
let playerId
const allPlayersRef = firebase.database().ref('players')
let players = []

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
//PLAYER
function handleArrowPress(velX = 0, velY = 0) {
    playerRef.update({
        x: players[playerId].x + velX,
        y: players[playerId].y + velY,
    })
}

//LISTENERS
function initListeners() {
    allPlayersRef.on('value', (snapshot) => {
        c.clearRect(0, 0, canvas.width, canvas.height)
        //draw all players
        players = snapshot.val() || {}
        Object.keys(players).forEach((key) => {
            c.fillStyle = players[key].color
            c.fillRect(players[key].x, players[key].y, 30, 30)
        })
    })

    allPlayersRef.on('child_added', (snapshot) => {
        players = snapshot.val() || {}
    })

    new KeyListener('ArrowUp', () => handleArrowPress(0, -30))
    new KeyListener('ArrowDown', () => handleArrowPress(0, 30))
    new KeyListener('ArrowLeft', () => handleArrowPress(-30, 0))
    new KeyListener('ArrowRight', () => handleArrowPress(30, 0))
}
