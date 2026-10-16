export function Map(width, height) {
    const size = { width, height };
    const map = {
        size,
        isValid({ x, y }) {
            if (x < 0) {
                return false;
            }
            if (x >= width) {
                return false;
            }
            if (y < 0) {
                return false;
            }
            if (y >= height) {
                return false;
            }
            return true;
        },
        render({ x, y }, ch = 'X') {
            for (let v = 0; v < width; v++) {
                process.stdout.write('+-');
            }
            console.log('+');
            for (let v = 0; v < height; v++) {
                for (let u = 0; u < width; u++) {
                    if (u === x && v === y) {
                        process.stdout.write(`|${ch}`);
                        continue;
                    }
                    process.stdout.write('| ');
                }
                console.log('|');
                for (let v = 0; v < width; v++) {
                    process.stdout.write('+-');
                }
                console.log('+');
            }
        },
    };
    return map;
}
