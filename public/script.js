new Game(document.querySelector('canvas'))

const allPlayersRef = firebase.database().ref('players')
const tilesRef = firebase.database().ref('tiles')
const [playerId, playerRef] = firebaseInit()

//LISTENERS
function initListeners() {
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
initListeners()
