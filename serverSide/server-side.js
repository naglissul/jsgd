//firebase
var admin = require('firebase-admin')

var serviceAccount = require('./admin-private.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
        'https://jsgd-5396b-default-rtdb.europe-west1.firebasedatabase.app',
})

var db = admin.database()
var serverRef = db.ref('server')
serverRef.set({ isRunning: 'true' })

//Whiping players
let playersRef = db.ref('players')

let players
playersRef.on('value', (snapshot) => {
    players = snapshot.val() || {}
})

let prevPlayers = {}

setInterval(function () {
    const keys1 = Object.keys(players)
    for (let key of keys1) {
        if (prevPlayers.hasOwnProperty(key)) {
            if (
                prevPlayers[key].x === players[key].x &&
                prevPlayers[key].y === players[key].y
            ) {
                db.ref(`players/${key}`).remove()
                console.log(key + ' removed')
            }
        }
    }
    prevPlayers = players
}, 60000)

//Before exiting
process.on('SIGINT', () => {
    console.log('Received SIGINT signal')
    process.exit(0)
})

process.on('beforeExit', (code) => {
    console.log('Ending processes...')

    serverRef.remove()
    console.log('Exiting with code:', code)
})

process.on('exit', (code) => {
    console.log('Ending processes...')
    serverRef.remove()

    console.log('Exiting with code:', code)
})
