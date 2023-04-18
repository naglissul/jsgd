function firebaseInit() {
    let playerId
    let playerRef

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

    allPlayersRef.on('value', (snapshot) => {
        players = snapshot.val() || {}
    })

    allPlayersRef.on('child_added', (snapshot) => {
        players = snapshot.val() || {}
    })

    tilesRef.on('value', (snapshot) => {
        tiles = snapshot.val() || {}
    })

    tilesRef.on('child_added', (snapshot) => {
        tiles = snapshot.val() || {}
    })

    return [playerId, playerRef]
}
