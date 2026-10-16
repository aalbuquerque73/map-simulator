import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PassThrough } from 'node:stream';
import { runner, simulate } from '../src/runner.js';

describe('runner', () => {
    it('runs a simulation', () => {
        const oldLog = console.log;
        const input = [4, 4, 2, 2, 1, 0];
        const logs = [];
        console.log = (...args) => logs.push(args);
        simulate(input);
        assert.deepStrictEqual(logs, [['[2, 1]']]);
        console.log = oldLog;
    });

    it('runs a simulation from a stream with a non numeric value', async () => {
        const oldLog = console.log;
        const input = new PassThrough();
        const logs = [];
        console.log = (...args) => logs.push(args);
        const promise = runner(input);
        input.end('4,4 2,2\n1,4,1,3,2,3,2,4,non-numeric,1,0\n');
        const result = await promise;
        assert.deepStrictEqual(result, [4, 4, 2, 2, 1, 4, 1, 3, 2, 3, 2, 4, 0, 1, 0]);
        simulate(result);
        assert.deepStrictEqual(logs, [['[0, 2]']]);
        console.log = oldLog;
    });

    it('runs a simulation from a stream', async () => {
        const oldLog = console.log;
        const input = new PassThrough();
        const logs = [];
        console.log = (...args) => logs.push(args);
        const promise = runner(input);
        input.end('4,4 2,2\n1,4,1,3,2,3,2,4,1,0\n');
        const result = await promise;
        assert.deepStrictEqual(result, [4, 4, 2, 2, 1, 4, 1, 3, 2, 3, 2, 4, 1, 0]);
        simulate(result);
        assert.deepStrictEqual(logs, [['[0, 1]']]);
        console.log = oldLog;
    });
});
