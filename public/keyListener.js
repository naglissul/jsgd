class KeyListener {
    constructor(keyCode, callback, callbackUp) {
        this.keydownFunction = function (event) {
            if (event.key === keyCode) {
                callback()
            }
        }
        this.keyupFunction = function (event) {
            if (event.key === keyCode) {
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
