;(function () {
    const input = document.querySelector('input')
    const lastValue = localStorage.getItem('name')
    if (lastValue) {
        input.value = lastValue
    }

    input.addEventListener('input', (event) => {
        const value = event.target.value
        localStorage.setItem('name', value)
    })

    input.addEventListener('focus', () => {
        input.selectionStart = input.value.length
        input.selectionEnd = input.value.length
    })
})()

function nameGiven(name) {
    document.querySelector('input').remove()
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    new Game(canvas, name)
}
//make work and not lag for mac and mobile
//congrats something more

//Continue with the original idea
