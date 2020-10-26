import React from 'react';
import './Game.css'

function Rules() {
    return (
        <div class="container">
            <h3>About Conway's Game of Life:</h3>
                <p>Life is played on a grid of cells. A cell can be live or dead. A live cell is shown by putting a marker on it. A dead cell is shown by leaving it empty. Each cell in the grid has a neighborhood consisting of the eight cells in every direction including diagonals. We count the live neighbors for each cell and what happens next depends on this number.</p>
            <h4>Rules:</h4>
            <p>1. A live cell with only one neighbor dies (loneliness)</p>
            <p>2. A live cell with two or three neighbors has no change (survival)</p>
            <p>3. A dead cell with exactly three neighbors becomes alive (birth)</p>
            <p>4. A live cell with four or more neighbors dies (overcrowding) </p>
        </div>
    )
}

export default Rules