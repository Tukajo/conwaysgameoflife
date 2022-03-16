import { resolvePosition } from './ConwayUtils';

test('It should resolve the E, S, and SE positions at x = 0 , y = 0', () => {
    const gameBoard = [
        [0, 1],
        [1, 1],
    ];
    const result = resolvePosition(gameBoard, 0, 0);
    expect(result).toEqual(1);
});

test('It should resolve the N, W, and NW positions at x = 1, y = 1', () => {
    const gameBoard = [
        [0, 1],
        [1, 1],
    ];
    const result = resolvePosition(gameBoard, 1, 1);
    expect(result).toEqual(1);
});