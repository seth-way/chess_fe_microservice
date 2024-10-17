import './Game.css';
import { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { sampleGameObject } from '../../../mock_data/dummyGame';

const Game = () => {
  const [game, setGame] = useState(initializeGame());
  const [playerColor, setPlayerColor] = useState('black')
  const [gameJson, setGameJson] = useState(sampleGameObject)

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    console.log(game.fen())
    return result;
  }

  function initializeGame(){
    const game = new Chess()
    return(game)
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

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} boardOrientation={playerColor} />;
};

export default Game;
