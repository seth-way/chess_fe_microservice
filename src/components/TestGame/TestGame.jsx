import './TestGame.css';
import { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const TestGame = ({ fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}) => {
  const [game, setGame] = useState(new Chess(fen));
  const [sourceSquare, setSourceSquare] = useState(null);

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result;
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    console.log(game.fen());
    setTimeout(makeRandomMove, 200);
    return true;
  }

  function handlePieceClick(piece, square) {
    setSourceSquare(() => square);
  }

  function handleSquareClick(square, piece) {
    const move = makeAMove({
      from: sourceSquare,
      to: square,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    console.log(game.fen());
    setTimeout(makeRandomMove, 200);
    setSourceSquare(() => null)
    return true;
  }

  return (
    <div className='game-area'>
      <Chessboard position={game.fen()} arePiecesDraggable={false} onSquareClick={handleSquareClick} onPieceClick={handlePieceClick} />
    </div>
  );
}

export default TestGame