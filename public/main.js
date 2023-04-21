function nameGiven(name) {
    const canvas = document.createElement('canvas')
    document.querySelector('input').remove()
    document.body.appendChild(canvas)
    new Game(canvas, name)
}
//Make an order in joining/leaving players. names
//make work and not lag for mac and mobile
//Continue with the original idea
