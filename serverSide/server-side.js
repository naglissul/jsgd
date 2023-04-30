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

const now = new Date()
let millisTill927 =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 0, 0, 0) -
    now
if (millisTill927 < 0) {
    millisTill927 += 86400000
}
setTimeout(function () {
    console.log('Midnight')
    playersRef.remove()
}, millisTill927)

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
