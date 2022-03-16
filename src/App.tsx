import React, { useCallback, useRef, useState } from 'react';
import { produce } from 'immer';
import './App.css';
import { MAX_HEIGHT, MAX_WIDTH, resolvePosition } from './utils/ConwayUtils';

function App() {
  const [gameBoard, setGameBoard] = useState<number[][]>(Array(MAX_WIDTH).fill(Array(MAX_HEIGHT).fill(0)));
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(200);
  const gameSpeedRef = useRef<number>(gameSpeed);
  const simulationRunningRef = useRef<boolean>(simulationRunning);
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
              gameBoardCopy[x][y] = resolvePosition(g, x, y);
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
        <button
            style={{ width: '200px', height: '50px' }}
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
        <input
            type={'numeric'}
            value={gameSpeed}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              setGameSpeed(num);
            }}
        />
      </div>
  );
}

export default App;