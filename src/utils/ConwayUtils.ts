export const MAX_HEIGHT = 50,
    MAX_WIDTH = 50,
    MIN_HEIGHT = 0,
    MIN_WIDTH = 0;
export const NeighborRelativePositions: number[][] = [
    [-1, -1],
    [-1, 0],
    [0, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [0, 1],
    [1, 0],
];
export const resolvePosition = (originalBoard: number[][], x: number, y: number): number => {
    let neighbors = 0;
    let isLiving: number = originalBoard[x][y];
    const maxDimensionX = originalBoard[0].length;
    const maxDimensionY = originalBoard.length;
    for (const position of NeighborRelativePositions) {
        const [xNeighbor, yNeighbor] = position;
        const relativeX = x + xNeighbor;
        const relativeY = y + yNeighbor;
        if (
            relativeX >= MIN_WIDTH &&
            relativeX < maxDimensionX &&
            relativeY >= MIN_HEIGHT &&
            relativeY < maxDimensionY
        ) {
            neighbors += originalBoard[relativeX][relativeY];
        }
    }

    if (isLiving && neighbors < 2) {
        // Any living cell with fewer than two live neighbors dies, as if by underpopulation.
        isLiving = 0;
    } else if (isLiving && neighbors <= 3) {
        // Any living cell with two or three live neighbors lives on to the next generation.
        isLiving = 1;
    } else if (isLiving && neighbors > 3) {
        // Any living cell with more than three live neighbors dies, as if by overpopulation.
        isLiving = 0;
    } else if (!isLiving && neighbors === 3) {
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        isLiving = 1;
    }
    return isLiving;
};