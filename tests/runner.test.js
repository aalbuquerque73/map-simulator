import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';
import { PassThrough } from 'node:stream';
import { runner, simulate } from '../src/runner.js';

describe('runner', () => {
    const logs = [];
    const logger = {
        start() {},
        step() {},
        stop() {},
        log(...args) {
            logs.push(args);
        },
    };
    
    beforeEach(() => {
        logs.length = 0;
    });

    it('runs a simulation', async () => {
        const input = [4, 4, 2, 2, 1, 0];
        await simulate(input, logger);
        assert.deepStrictEqual(logs, [['[2, 1]']]);
    });

    it('runs a simulation from a stream with a non numeric value', async () => {
        const input = new PassThrough();
        const promise = runner(input);
        input.end('4,4 2,2\n1,4,1,3,2,3,2,4,non-numeric,1,0\n');
        const result = await promise;
        assert.deepStrictEqual(result, [4, 4, 2, 2, 1, 4, 1, 3, 2, 3, 2, 4, 0, 1, 0]);
        await simulate(result, logger);
        assert.deepStrictEqual(logs, [['[0, 2]']]);
    });

    it('runs a simulation from a stream', async () => {
        const input = new PassThrough();
        const promise = runner(input);
        input.end('4,4 2,2\n1,4,1,3,2,3,2,4,1,0\n');
        const result = await promise;
        assert.deepStrictEqual(result, [4, 4, 2, 2, 1, 4, 1, 3, 2, 3, 2, 4, 1, 0]);
        await simulate(result, logger);
        assert.deepStrictEqual(logs, [['[0, 1]']]);
    });
});
