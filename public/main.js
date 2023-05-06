;(function () {
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
    }
    if (isMobileDevice()) {
        const dialog = document.createElement('div')
        const message = document.createElement('h4')
        message.textContent =
            'I see you are not using PC. Sadly, you will not be able to play the game :('
        dialog.style = `position: absolute; top: ${innerHeight} ; right: ${innerWidth}; width: 500px; padding: 50px; border: 1px solid; text-align: center; background-color: #FFC2C2`
        message.style = 'text-align: center'
        const button = document.createElement('button')
        button.textContent = 'OK'
        button.onclick = () => {
            alert('What do you want me to do? Please, just close this tab...')
        }

        dialog.appendChild(message)
        dialog.appendChild(button)
        document.body.appendChild(dialog)
    }

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
    document.querySelector('#inputbox').remove()

    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    new Game(canvas, name)
}
//make work and not lag for mac and mobile
//congrats something more

//Continue with the original idea
