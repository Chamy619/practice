//import { checkPropTypes } from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    const board = [];
    const TABLE_SIZE = 3;

    for (let row = 0; row < TABLE_SIZE; row++) {
      const boardRow = [];
      for (let col = 0; col < TABLE_SIZE; col++) {
        boardRow.push(this.renderSquare((row * 3) + col));
      }
      board.push(<div key={row} className="board-row">{boardRow}</div>);
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: {
          row: null,
          col: null
        }
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleAscending = this.handleAscending.bind(this);
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const xIsNext = this.state.xIsNext;
    squares[i] = xIsNext ? 'X' : 'O';

    const row = Math.floor(i / 3);
    const col = i % 3;
    this.setState({
      history: history.concat([{
        squares: squares,
        position: {
          row: row,
          col: col
        }
      }]),
      stepNumber: history.length,
      xIsNext: !xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      history: this.state.history.splice(0, step + 1),
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleAscending() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    const sort = this.state.isAscending ? 'Ascending' : 'Descending';

    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move + '(' + step.position.row + ', ' + step.position.col + ')':
        'Go to game start';

      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'font-weight-bold' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.isAscending) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner; 
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={this.handleClick} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          <button onClick={this.handleAscending}>{sort}</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
