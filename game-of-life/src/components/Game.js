import React from 'react';
import './Game.css';
import Cell from './Cell.js';
import Constants from './Constants.js';
import Rules from './Rules.js'

let genCount = 1;

class Game extends React.Component {

    constructor() {
        super();
        this.rows = Constants.HEIGHT / Constants.CELL_SIZE;
        this.cols = Constants.WIDTH / Constants.CELL_SIZE;

        this.board = this.makeEmptyBoard();
    }

    state = {
        cells: [],
        isRunning: false,
        interval: 100,
        darkMode: false,
    }

    makeEmptyBoard() {
        // set board rows and columns to empty/0
        let board = [];
        for (let y = 0; y < this.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }

        return board;
    }

    // calculate position of board element
    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }

    makeCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    handleClick = (event) => {

        // retrieve click position
        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;
        // convert to relative position
        const x = Math.floor(offsetX / Constants.CELL_SIZE);
        const y = Math.floor(offsetY / Constants.CELL_SIZE);
        // calculate cols and rows of cell being clicked
        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
        }

        this.setState({ cells: this.makeCells() });
    }

    runGame = () => {
        this.setState({ isRunning: true });
        this.runIteration();
    }

    stopGame = () => {
        this.setState({ isRunning: false });
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    }

    runIteration() {
        let newBoard = this.makeEmptyBoard();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });
        genCount++

        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value });
    }

    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells() });
        genCount = 1
    }

    handleRandom = () => {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.board[y][x] = (Math.random() >= 0.5);
            }
        }

        this.setState({ cells: this.makeCells() });
    }
    handleNext = () => {
        // start iteration
        this.setState({ isRunning: true })
        this.runIteration()
        // stop iteration
        this.stopGame()
    }
    handleDarkMode= () => {
        if(this.state.darkMode === true) {
            this.setState({ darkMode: false })
        } else {
            this.setState({ darkMode: true })
        }
    }

    render() {
        const { cells, interval, isRunning } = this.state;
        return (
            <div>
                <div>Generation: {genCount}</div>
                <div className={this.state.darkMode ? "darkModeBoard" : "Board"}
                    style={{ width: Constants.WIDTH, height: Constants.HEIGHT, backgroundSize: `${Constants.CELL_SIZE}px ${Constants.CELL_SIZE}px`}}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardRef = n; }}>

                    {cells.map(cell => (
                        <Cell darkMode={this.state.darkMode} x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>
                    ))}
                </div>

                <div className="controls">
                    Speed: <input value={interval} onChange={this.handleIntervalChange} /> msec
                    {isRunning ?
                        <button className="button" onClick={this.stopGame}>Stop</button> :
                        <button className="button" onClick={this.runGame}>Run</button>
                    }
                    <button className="button" onClick={this.handleNext}>Next</button>
                    <button className="button" onClick={this.handleRandom}>Random</button>
                    <button className="button" onClick={this.handleClear}>Clear</button>
                    <button className="button" onClick={this.handleDarkMode}>Dark Mode</button>
                </div>
                <div className="rules">
                    <Rules />
                </div>
            </div>
        );
    }
}


export default Game;