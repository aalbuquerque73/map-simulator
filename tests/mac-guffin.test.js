import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MacGuffin } from '../src/mac-guffin.js';

describe('MacGuffin', () => {
    it('Create a MacGuffin at position (1, 1)', () => {
        const macGuffin = new MacGuffin(1, 1);
        assert.deepStrictEqual(macGuffin.position, { x: 1, y: 1 });
    });

    it('Move MacGuffin forward', () => {
        const macGuffin = new MacGuffin(1, 2);
        assert.deepStrictEqual(macGuffin.position, { x: 1, y: 2 });
        macGuffin.moveForward();
        assert.deepStrictEqual(macGuffin.position, { x: 1, y: 1 });
    });

    it('Move MacGuffin backward', () => {
        const macGuffin = new MacGuffin(1, 2);
        assert.deepStrictEqual(macGuffin.position, { x: 1, y: 2 });
        macGuffin.moveBackward();
        assert.deepStrictEqual(macGuffin.position, { x: 1, y: 3 });
    });

    it('Rotate MacGuffin clockwise', () => {
        const macGuffin = new MacGuffin(1, 2);
        assert.deepStrictEqual(macGuffin.position, { x: 1, y: 2 });
        macGuffin.rotateClockwise();
        macGuffin.moveForward();
        assert.deepStrictEqual(macGuffin.position, { x: 2, y: 2 });
    });

    it('Rotate MacGuffin counter-clockwise', () => {
        const macGuffin = new MacGuffin(2, 2);
        assert.deepStrictEqual(macGuffin.position, { x: 2, y: 2 });
        macGuffin.rotateCounterClockwise();
        macGuffin.moveForward();
        assert.deepStrictEqual(macGuffin.position, { x: 1, y: 2 });
    });
});
