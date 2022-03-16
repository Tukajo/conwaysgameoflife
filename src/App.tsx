import React, { useCallback, useRef, useState } from 'react';
import { produce } from 'immer';
import './App.css';
import { MAX_HEIGHT, MAX_WIDTH, resolvePosition } from './utils/ConwayUtils';

function App() {
    const [gameBoard, setGameBoard] = useState<number[][]>(Array(MAX_WIDTH).fill(Array(MAX_HEIGHT).fill(0)));
    const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
    const [gameSpeed, setGameSpeed] = useState<number>(200);
    const [toroidalBorders, setToroidalBorders] = useState<boolean>(false);
    const gameSpeedRef = useRef<number>(gameSpeed);
    const simulationRunningRef = useRef<boolean>(simulationRunning);
    const toroidalBordersRef = useRef<boolean>(toroidalBorders);
    toroidalBordersRef.current = toroidalBorders;
    gameSpeedRef.current = gameSpeed;
    simulationRunningRef.current = simulationRunning;

    const handleTogglePosition = (x: number, y: number): void => {
        setSimulationRunning(false);
        setGameBoard(
            produce(gameBoard, (gameBoardCopy) => {
                gameBoardCopy[x][y] = gameBoard[x][y] ? 0 : 1;
            }),
        );
    };

    const startSimulation = useCallback(() => {
        if (simulationRunningRef.current) {
            setGameBoard((g) => {
                return produce(g, (gameBoardCopy) => {
                    for (let x = 0; x < gameBoardCopy.length; x++) {
                        for (let y = 0; y < gameBoardCopy.length; y++) {
                            gameBoardCopy[x][y] = resolvePosition(g, x, y, toroidalBordersRef.current);
                        }
                    }
                });
            });
        }
        const timeoutId = setTimeout(startSimulation, gameSpeedRef.current);
        if (!simulationRunningRef.current) {
            clearTimeout(timeoutId);
            return;
        }
    }, []);

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${MAX_WIDTH},20px` }}>
                    {gameBoard.map((row: number[], i) =>
                        row.map((_column: number, j) => {
                            const key = `el_${i}_${j}`;
                            return (
                                <div
                                    key={key}
                                    onClick={() => {
                                        handleTogglePosition(i, j);
                                    }}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: gameBoard[i][j] ? 'skyblue' : undefined,
                                        border: '1px solid black',
                                    }}
                                />
                            );
                        }),
                    )}
                </div>
                <span style={{ display: 'flex', flexDirection: 'row' }}>
                    <button
                        style={{ width: '200px', height: '50px', margin: '10px' }}
                        onClick={() => {
                            setSimulationRunning(!simulationRunning);
                            if (!simulationRunning) {
                                simulationRunningRef.current = true;
                                startSimulation();
                            }
                        }}
                    >
                        {simulationRunning ? 'pause' : 'start'}
                    </button>
                    <div style={{ margin: '10px', padding: '5px' }}>
                        <label>
                            <input
                                type={'numeric'}
                                value={gameSpeed}
                                onChange={(e) => {
                                    const { value: rawValue } = e.target;
                                    const num = parseInt(rawValue || '0');
                                    setGameSpeed(num);
                                }}
                            />
                            <span>game speed</span>
                        </label>
                    </div>
                    <div style={{ margin: '10px', padding: '5px' }}>
                        <label className={'switch'}>
                            <input
                                type="checkbox"
                                value={`${toroidalBorders}`}
                                onChange={() => {
                                    setToroidalBorders(!toroidalBorders);
                                }}
                            />
                            <span>Wrap Toroidal</span>
                        </label>
                    </div>
                </span>
            </div>
        </div>
    );
}

export default App;
