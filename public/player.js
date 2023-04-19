class Player {
    velY = 0
    velX = 0
    contructor(game) {
        this.playerId = playerId
    }

    update() {
        if (players[this.playerId]) {
            this.velY += 1
            let x = players[this.playerId].x
            let y = players[this.playerId].y
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

}