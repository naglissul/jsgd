class LocalPlayer {
    constructor(id, name, game) {
        this.id = id
        this.game = game
        this.ref = firebase.database().ref(`players/${id}`)
        this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 30))
        this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 30))
        this.colorNumber = RANDOM_COLOR_NUMBER()
        this.name = name ? name : RANDOM_NAME()
        this.velX = 0
        this.velY = 0

        this.ref.set({
            id: this.id,
            name: this.name,
            color: COLORS[this.colorNumber],
            x: this.x,
            y: this.y,
        })
    }

    update() {
        this.velY += 0.5

        this.x += this.velX
        this.y += this.velY

        if (this.y > CANVAS_HEIGHT - 30) {
            this.velY = -this.velY + 10
            this.y = CANVAS_HEIGHT - 30
        }
        if (this.x > CANVAS_WIDTH - 30) {
            this.x = CANVAS_WIDTH - 30
        }
        if (this.x < 0) {
            this.x = 0
        }
        this.ref.update({ x: this.x, y: this.y })
    }
}
