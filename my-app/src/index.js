import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={() => props.onClick()}
      style={ props.isWinningSquare ? { backgroundColor: 'green' } : { backgroundColor: 'white' } }
    >
      { props.value }
    </button>
  );
}

  
class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
          isWinningSquare={this.props.winningSquares.includes(i)}
        />
      );
    }

    createSquares() {
      let rows = [];
      for (var i = 0; i < 3; i++) {
        let cols = [];
        for (var j = 0; j < 3; j++) {
          cols.push(this.renderSquare(i*3+j));
        }
        rows.push(<div className="board-row">{cols}</div>);
      }
      return rows;
    }
  
    render() {
      return (
        <div>
          {this.createSquares()}
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
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    }
  }  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice()
    if (calculateWinner(squares).length > 0 || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coordinates: [Math.floor(i/3) + 1, i%3 + 1]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  changeSorting(order) {
    this.setState({
      isAscending: !order
    })
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //step = square, move = index
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)} 
            style={ this.state.stepNumber === move ? { fontWeight: 'bold' } : { fontWeight: 'normal' } }>
              {desc}
          </button>
        </li>
      );
    });

    if(!this.state.isAscending) {
      moves.reverse();
    }

    const changeorder = this.state.isAscending ? 'Change to descending' : 'Change to ascending';
    const toggle = (
        <button 
          onClick={() => this.changeSorting(this.state.isAscending)} 
        >
          {changeorder}
        </button>
    );
    
    let status;
    if (winner.length > 0) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else if (this.state.stepNumber === 9) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{toggle}</div>
          <ol>{moves}</ol>
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
      // return squares[a];
      return [a, b, c];
    }
  }
  return [];
}
