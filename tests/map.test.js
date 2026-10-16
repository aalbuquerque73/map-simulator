import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Map } from '../src/map.js';

describe('Map', () => {
    it('Creates a map with size 4x4', () => {
        const map = new Map(4, 4);
        assert.deepStrictEqual(map.size, { width: 4, height: 4 });
    });

    it('Validates true', () => {
        const map = new Map(2, 2);
        assert.deepStrictEqual(map.size, { width: 2, height: 2 });
        assert.strictEqual(map.isValid({ x: 0, y: 0 }), true);
        assert.strictEqual(map.isValid({ x: 0, y: 1 }), true);
        assert.strictEqual(map.isValid({ x: 1, y: 0 }), true);
        assert.strictEqual(map.isValid({ x: 1, y: 1 }), true);
    });

    it('Validates false', () => {
        const map = new Map(1, 1);
        assert.deepStrictEqual(map.size, { width: 1, height: 1 });
        assert.strictEqual(map.isValid({ x: -1, y: 0 }), false);
        assert.strictEqual(map.isValid({ x: 0, y: -1 }), false);
        assert.strictEqual(map.isValid({ x: 0, y: 1 }), false);
        assert.strictEqual(map.isValid({ x: 1, y: 0 }), false);
        assert.strictEqual(map.isValid({ x: 1, y: 1 }), false);
    });
});
