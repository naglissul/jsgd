class KeyListener {
    constructor(keyCode, callback, callbackUp) {
        this.keydownFunction = function (event) {
            if (event.code === keyCode) {
                callback()
            }
        }
        this.keyupFunction = function (event) {
            if (event.code === keyCode) {
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
