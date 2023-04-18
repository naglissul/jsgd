function tileUpdate() {}
function tileRender(key, ctx) {
    ctx.fillStyle = 'black'
    ctx.fillRect(tiles[key].x, tiles[key].y, 30, 30)
}
