import './Game.css';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const Game = () => {
	const [game, setGame] = useState(new Chess());

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

	return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
};

export default Game;
