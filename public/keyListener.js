class KeyListener {
    constructor(keyCodes, callback, callbackUp) {
        this.keydownFunction = function (event) {
            if (keyCodes.some((code) => code === event.code)) {
                callback()
            }
        }
        this.keyupFunction = function (event) {
            if (keyCodes.some((code) => code === event.code)) {
                callbackUp()
            }
        }
        document.addEventListener('keydown', this.keydownFunction)
        document.addEventListener('keyup', this.keyupFunction)
    }

    unbind() {
        document.removeEventListener('keydown', this.keydownFunction)
        document.removeEventListener('keyup', this.keyupFunction)
    }
}
