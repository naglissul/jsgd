let velY = 0
let velX = 0

function playerUpdate(playerId) {
    if (players[playerId]) {
        velY += 1
        let x = players[playerId].x
        let y = players[playerId].y
        x += velX
        y += velY

        if (y > canvas.height - 30) {
            y = canvas.height - 30
        }
        if (x > canvas.width - 30) {
            x = canvas.width - 30
        }
        if (x < 0) {
            x = 0
        }

        playerRef.update({ x: x, y: y })
    }
}
function playerRender(key, ctx) {
    ctx.fillStyle = players[key].color
    ctx.fillRect(players[key].x, players[key].y, 30, 30)
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText(players[key].name, players[key].x + 15, players[key].y - 3)
}
