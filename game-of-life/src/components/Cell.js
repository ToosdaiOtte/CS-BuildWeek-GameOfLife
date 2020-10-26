import React from 'react';
import Constants from './Constants.js';

class Cell extends React.Component {

    render() {
        const { x, y } = this.props;
        return (
            <div className="Cell" style={{
                left: `${Constants.CELL_SIZE * x + 1}px`,
                top: `${Constants.CELL_SIZE * y + 1}px`,
                width: `${Constants.CELL_SIZE - 1}px`,
                height: `${Constants.CELL_SIZE - 1}px`,
            }} />
        );
    }
}

export default Cell;