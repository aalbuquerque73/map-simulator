import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Map } from '../src/map.js';
import { MacGuffin } from '../src/mac-guffin.js';
import { StateMachine } from '../src/state-machine.js';

describe('StateMachine', () => {
    it('Creates a state machine', () => {
        const map = new Map(1, 1);
        const macGuffin = new MacGuffin(0, 0);
        const stateMachine = new StateMachine(map, macGuffin);
        assert.notEqual(stateMachine, null);
    });

    it('Writes [1, 1] to the console', async () => {
        const oldLog = console.log;
        const map = new Map(2, 2);
        const macGuffin = new MacGuffin(0, 0);
        const stateMachine = new StateMachine(map, macGuffin);
        const commands = [3, 1, 3, 1, 0];
        const logs = [];
        console.log = (...args) => logs.push(args);
        stateMachine.simulate(commands);
        assert.deepStrictEqual(logs, [['[1, 1]']]);
        console.log = oldLog;
    });

    it('Writes [-1, -1] to the console', async () => {
        const oldLog = console.log;
        const map = new Map(2, 2);
        const macGuffin = new MacGuffin(0, 0);
        const stateMachine = new StateMachine(map, macGuffin);
        let commands = [1, 1, 0];
        const logs = [];
        console.log = (...args) => logs.push(args);
        stateMachine.simulate(commands);
        assert.deepStrictEqual(logs, [['[-1, -1]']]);
        macGuffin.setPosition(0, 0)
        commands = [4, 1, 1, 0]
        stateMachine.simulate(commands);
        assert.deepStrictEqual(logs, [['[-1, -1]'], ['[-1, -1]']]);
        console.log = oldLog;
    });

    it('Writes [-1, -1] to the console even if it moves back to the map', async () => {
        const oldLog = console.log;
        const map = new Map(2, 2);
        const macGuffin = new MacGuffin(0, 0);
        const stateMachine = new StateMachine(map, macGuffin);
        let commands = [1, 1, 0];
        const logs = [];
        console.log = (...args) => logs.push(args);
        stateMachine.simulate(commands);
        assert.deepStrictEqual(logs, [['[-1, -1]']]);
        macGuffin.setPosition(0, 0)
        commands = [4, 1, 2, 2, 0]
        stateMachine.simulate(commands);
        assert.deepStrictEqual(logs, [['[-1, -1]'], ['[-1, -1]']]);
        console.log = oldLog;
    });
});
