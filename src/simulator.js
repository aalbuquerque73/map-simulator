export function Simulator(map, macGuffin) {
    const machine = {
        async simulate(commands) {
            const list = commands.slice();
            console.error(`commands: ${commands}`);
            await render(map.size, macGuffin.position, macGuffin.icon, false);
            while (list.length > 0) {
                const step = list.shift();
                console.error(`Step: ${step}`);
                process.stderr.write('\x1b[A');
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
                await render(map.size, macGuffin.position, macGuffin.icon);
            }
            console.log(`[${macGuffin.position.x}, ${macGuffin.position.y}]`);
            return machine;
        }
    };
    return machine;
}

async function render({ width, height }, { x, y }, ch = 'X', moveUp=true) {
    if (moveUp) {
        for (let v = 0; v < height; v++) {
            process.stderr.write('\x1b[A');
            process.stderr.write('\x1b[A');
        }
        process.stderr.write('\x1b[A');
    }
    for (let v = 0; v < width; v++) {
        process.stderr.write('+-');
    }
    console.error('+');
    for (let v = 0; v < height; v++) {
        for (let u = 0; u < width; u++) {
            if (u === x && v === y) {
                process.stderr.write(`|${ch}`);
                continue;
            }
            process.stderr.write('| ');
        }
        console.error('|');
        for (let v = 0; v < width; v++) {
            process.stderr.write('+-');
        }
        console.error('+');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
}
