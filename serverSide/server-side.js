var admin = require('firebase-admin')

var serviceAccount = require('./admin-private.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
        'https://jsgd-5396b-default-rtdb.europe-west1.firebasedatabase.app',
})

const auth = admin.auth()

let midnight = new Date()
midnight.setHours(21)
midnight.setMinutes(17)
midnight.setSeconds(0)
midnight.setMilliseconds(0)

var db = admin.database()
var playerRef = db.ref('players/server')
let playersRef = db.ref('players')
playerRef.set({
    id: 'server',
    name: 'serveriukas',
    color: 'gray',
    x: 100,
    y: 100,
})

process.on('beforeExit', (code) => {
    playerRef.remove()
})

const now = new Date()
const millisTill9 =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) - now
if (millisTill9 < 0) {
    millisTill9 += 86400000
}
setTimeout(function () {
    console.log('Midnight')
    playersRef.remove()
}, millisTill9)
