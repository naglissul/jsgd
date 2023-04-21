function nameGiven(name) {
    document.querySelector('input').remove()
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    new Game(canvas, name)
}
//Make an order in joining/leaving players. names
//make work and not lag for mac and mobile

//Original picture appear
//good/bad and count
//Continue with the original idea
