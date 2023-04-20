;(function () {
    const canvas = document.querySelector('canvas')
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    new Game(ctx)
})()

//bug - stil sends data when dead
//canvas size
