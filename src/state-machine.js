export function StateMachine(map, macGuffin) {
    const machine = {
        async simulate(commands) {
            const list = commands.slice();
            while (list.length > 0) {
                const step = list.shift();
                switch (step) {
                    case 1:
                        // Move forward
                        macGuffin.moveForward();
                        break;
                    case 2:
                        // Move backward
                        macGuffin.moveBackward();
                        break;
                    case 3:
                        // Rotate clockwise
                        macGuffin.rotateClockwise();
                        break;
                    case 4:
                        // Rotate counterclockwise
                        macGuffin.rotateCounterClockwise();
                        break;
                    case 0:
                        // Quit
                        list.length = 0;
                        break;
                }
                if (!map.isValid(macGuffin.position)) {
                    macGuffin.setPosition(-1, -1);
                    break;
                }
            }
            console.log(`[${macGuffin.position.x}, ${macGuffin.position.y}]`);
            return machine;
        }
    };
    return machine;
}
