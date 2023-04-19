const CANVAS_HEIGHT = 500
const CANVAS_WIDTH = 500

const playerColors = ['blue', 'red', 'orange', 'yellow', 'green', 'purple']

//Misc Helpers
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}
function createName() {
    const prefix = randomFromArray([
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
    ])
    const animal = randomFromArray([
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
    ])
    return `${prefix} ${animal}`
}
