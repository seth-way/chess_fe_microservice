import { Server } from 'socket.io';
import { Chess } from 'chess.js';
import getPort from 'get-port';
(async () => {
  let gameInfo;
  // Try to use port 57921, fallback if needed
  const port = await getPort({ port: 57921 });

  const io = new Server(port, {
    cors: {
      origin: 'http://localhost:5173', // Replace with your Vite app's URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', async socket => {
    const gameId = socket.handshake.query.gameId;
    console.log(`Connected to game with ID: ${gameId}`);
    gameInfo = await handleConnection(gameId, socket);
    sendLatest(gameInfo, socket);
  });

  io.on('make_move', fen => {
    console.log('mock server received move...', fen);
    const game = new Chess(fen.current);
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    gameInfo.previous_fen = gameInfo.current_fen;
    gameInfo.current_fen = game.fen();
    sendLatest(gameInfo, socket);
  });

  console.log(
    `Mock WebSocket server is running on port ${port} in development mode.`
  );

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
    const game = await import(`./dummyData/games/${gameId}.json`, {
      with: { type: 'json' },
    });
    sendLatest(game.default, socket);
    return game.default;
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
      turn_color: game.turn_color,
    },
  };

  socket.send(JSON.stringify(data));
}
