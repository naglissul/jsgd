const CANVAS_HEIGHT = 500
const CANVAS_WIDTH = 500

//Misc helpers
function RANDOM_COLOR() {
    const array = ['blue', 'red', 'orange', 'yellow', 'green', 'purple']
    return array[Math.floor(Math.random() * array.length)]
}
function RANDOM_NAME() {
    let array = [
        'COOL',
        'SUPER',
        'HIP',
        'SMUG',
        'COOL',
        'SILKY',
        'GOOD',
        'SAFE',
        'DEAR',
        'DAMP',
        'WARM',
        'RICH',
        'LONG',
        'DARK',
        'SOFT',
        'BUFF',
        'DOPE',
    ]
    const prefix = array[Math.floor(Math.random() * array.length)]
    array = [
        'BEAR',
        'DOG',
        'CAT',
        'FOX',
        'LAMB',
        'LION',
        'BOAR',
        'GOAT',
        'VOLE',
        'SEAL',
        'PUMA',
        'MULE',
        'BULL',
        'BIRD',
        'BUG',
    ]
    const animal = array[Math.floor(Math.random() * array.length)]
    return `${prefix} ${animal}`
}
