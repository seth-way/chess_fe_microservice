import './Game.css';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { sampleGameObject } from '../../../mock_data/dummyGame';

const Game = ({gameId, playerId}) => {
  const [playerColor, setPlayerColor] = useState('white')
  const [gameJson, setGameJson] = useState(sampleGameObject)
	const [game, setGame] = useState(initializeGame(gameJson));

	useEffect(() => {
		const socket = io('http://localhost:57921', {
      query: { gameId: 1111 } // Send gameId as part of the query
    });
		socket.connect();
	}, []);

	function makeAMove(move) {
		const gameCopy = { ...game };
		const result = gameCopy.move(move);
		setGame(gameCopy);
		return result;
	}

  function rotateBoard(playerId, existingGame){
    if(String(playerId) === existingGame.data.attributes.black_player_id){
      setPlayerColor('black')
    }
  }

  useEffect(()=>{
    rotateBoard(playerId, gameJson)
  },[])

  function initializeGame(existingGame){
    if (existingGame){
      const game = new Chess(existingGame.data.attributes.current_fen)
      return (game)
    }
    const game = new Chess()
    return(game)
  }

	function makeRandomMove() {
		const possibleMoves = game.moves();
		if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
		const randomIndex = Math.floor(Math.random() * possibleMoves.length);
		makeAMove(possibleMoves[randomIndex]);
	}

	function onDrop(sourceSquare, targetSquare) {
		const move = makeAMove({
			from: sourceSquare,
			to: targetSquare,
			promotion: 'q' // always promote to a queen for example simplicity
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
