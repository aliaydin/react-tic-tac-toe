import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {

  const handleSquareClick = (i) => 
  {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();

    if (xIsNext) nextSquares[i] = "X";
    else nextSquares[i] = "O";

    onPlay(nextSquares)
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) status = "Winner: " + winner;
  else status = "Next Player: " + (xIsNext ? "X" : "O");

  const renderSquares = () => {
    const renderedSquares = []
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        row.push(
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleSquareClick(index)}
          />
        );
      }
      renderedSquares.push(
        <div key={i} className="board-row">
          <div className="square square-number">{i+1}</div>
          {row}
        </div>
      );
    }
    return renderedSquares;
  }

  return (
    <>
      <div className="status">{status}</div>

      <div>
        <div className="square square-number"></div>
        <div className="square square-number">1</div>
        <div className="square square-number">2</div>
        <div className="square square-number">3</div>
      </div>

      {renderSquares()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquare = history[currentMove]
  const xIsNext = currentMove % 2 === 0
  
  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = 'Go to move #' + move
    } else {
      description = 'Go to game start'
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquare} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
