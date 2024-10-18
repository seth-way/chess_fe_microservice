import { Server } from 'socket.io';
import { Chess } from 'chess.js';
import getPort from 'get-port';
(async () => {
	// Try to use port 5000, fallback if needed
	const port = await getPort({ port: 57921 });

	const io = new Server(port, {
		cors: {
			origin: 'http://localhost:5173', // Replace with your Vite app's URL
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', async socket => {
		const gameId = socket.handshake.query.gameId;
		console.log(`Connected to game with ID: ${gameId}`);
		const game = await handleConnection(gameId, socket);
		console.log('GAME', game);
	});

	console.log(`Mock WebSocket server is running on port ${port} in development mode.`);

	// Graceful shutdown on SIGINT (e.g., when you press Ctrl+C)
	process.on('SIGINT', () => {
		console.log('Server shutting down...');
		io.close(() => {
			console.log('Server closed');
			process.exit(0); // Ensure exit after shutdown
		});
	});
})();

async function handleConnection(gameId, socket) {
	try {
		const game = await import(`./dummyData/games/${gameId}.json`);
		sendLatest(game, socket);
		return game;
	} catch (error) {
		console.error('Error loading the JSON file:', error);
	}
}

function sendLatest(game, socket) {
	const data = {
		event: 'latest',
		game: {
			current_fen: game.current_fen,
			previous_fen: game.previous_fen,
			white_player_id: game.white_player_id,
			black_player_id: game.black_player_id,
			turn_color: game.turn_color
		}
	};

	socket.send(JSON.stringify(data));
}

// function makeAMove(move) {
//   const gameCopy = { ...game };
//   const result = gameCopy.move(move);
//   setGame(gameCopy);
//   return result;
// }

// function makeRandomMove() {
//   const possibleMoves = game.moves();
//   if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
//     return;
//   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
//   makeAMove(possibleMoves[randomIndex]);
// }

// function onDrop(sourceSquare, targetSquare) {
//   const move = makeAMove({
//     from: sourceSquare,
//     to: targetSquare,
//     promotion: 'q', // always promote to a queen for example simplicity
//   });

//   // illegal move
//   if (move === null) return false;
//   console.log(game.fen());
//   setTimeout(makeRandomMove, 200);
//   return true;
// }
