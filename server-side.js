let midnight = new Date()
midnight.setHours(0)
midnight.setMinutes(0)
midnight.setSeconds(0)
midnight.setMilliseconds(0)

firebase
    .auth()
    .signInAnonymously()
    .catch((error) => {})
    .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                whipePlayers()
            } else {
            }
        })
    })

const playersRef = firebase.database().ref('players')

function whipePlayers() {
    let now = new Date()

    if (now.getTime() > midnight.getTime()) {
        midnight.setSeconds(1)
        if (now.getTime() < midnight.getTime()) {
            playersRef.remove()
            midnight.setSeconds(0)
        }
    }

    requestAnimationFrame(whipePlayers)
}
