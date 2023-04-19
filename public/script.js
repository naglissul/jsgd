;(function () {
    const canvas = document.querySelector('canvas')
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    new Game(ctx)
})()

const allPlayersRef = firebase.database().ref('players')
const tilesRef = firebase.database().ref('tiles')
