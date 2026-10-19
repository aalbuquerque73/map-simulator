import path from 'path';
import { fileURLToPath } from 'url';
import { stdin } from 'node:process';
import { pathToFileURL } from 'node:url';
import { MacGuffin } from './mac-guffin.js';
import { Map } from './map.js';
import { Simulator } from './simulator.js';

export function runner(stream = stdin) {
    return new Promise((resolve, reject) => {
        const input = [];

        stream.setEncoding('utf8');

        stream.on('data', (chunk) => {
            input.push(...(chunk.trim().split(/[\s,;]/g).map(guaranteeInt)));
        });

        stream.on('error', reject);

        stream.on('end', () => {
            resolve(input);
        });
    });
}

function guaranteeInt(value) {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
        return 0;
    }
    return intValue;
}

export function simulate(list) {
    const [width, height, x, y] = list;
    const commands = list.slice(4);
    const map = new Map(width, height);
    const macGuffin = new MacGuffin(x, y);
    const simulator = new Simulator(map, macGuffin);
    simulator.simulate(commands);
}

// Run interactively only when executed directly.
const filename = path.resolve(fileURLToPath(import.meta.url))
const command = path.resolve(process.argv[1])
if (filename == command) {
    const input = await runner();
    simulate(input);
}
