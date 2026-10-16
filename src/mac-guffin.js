export const DIRECTIONS = [
    /*NORTH*/ { x:  0, y: -1 },
    /*EAST*/  { x:  1, y:  0 },
    /*SOUTH*/ { x:  0, y:  1 },
    /*WEST*/  { x: -1, y:  0 },
];
const ICONS = [
    /*NORTH*/ '↑',
    /*EAST*/  '→',
    /*SOUTH*/ '↓',
    /*WEST*/  '←',
];

export function MacGuffin(x, y) {
    const position = { x, y };
    let direction = 0;

    const macGuffin = {
        position,
        icon: ICONS[direction],
        setPosition(x, y) {
            position.x = x;
            position.y = y;
            return macGuffin;
        },
        moveForward() {
            position.x += DIRECTIONS[direction].x;
            position.y += DIRECTIONS[direction].y;
            return macGuffin;
        },
        moveBackward() {
            position.x -= DIRECTIONS[direction].x;
            position.y -= DIRECTIONS[direction].y;
            return macGuffin;
        },
        rotateClockwise() {
            direction = (direction + 1) % DIRECTIONS.length;
            macGuffin.icon = ICONS[direction];
            return macGuffin;
        },
        rotateCounterClockwise() {
            direction = (direction + DIRECTIONS.length - 1) % DIRECTIONS.length;
            macGuffin.icon = ICONS[direction];
            return macGuffin;
        },
    };
    return macGuffin;
}
