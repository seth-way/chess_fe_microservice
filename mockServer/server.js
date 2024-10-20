import { Server } from 'socket.io';
import { Chess } from 'chess.js';
import getPort from 'get-port';
let gameInfo;

(async () => {
  // Try to use port 57921, fallback if needed
  const port = await getPort({ port: 57921 });

  const io = new Server(port, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    const gameId = socket.handshake.query.gameId;
    console.log(`Connected to game with ID: ${gameId}`);
    handleConnection(gameId, socket);

    socket.on('make_move', fen => {
      console.log('fennnnn', fen);
      gameInfo.previous_fen = gameInfo.current_fen;
      gameInfo.current_fen = makeRandomMove(fen.current);
      gameInfo.turn_color = gameInfo.current_fen.includes('w')
        ? 'white'
        : 'black';
      sendLatest(socket);
    });
  });

  console.log(
    `Mock WebSocket server is running on port ${port} in development mode.`
  );

  // Graceful shutdown on SIGINT (e.g., when you press Ctrl+C)
  process.on('SIGINT', () => {
    console.log('Server shutting down...');
    io.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
})();

async function handleConnection(gameId, socket) {
  try {
    const game = await import(`./dummyData/games/${gameId}.json`, {
      with: { type: 'json' },
    });
    console.log('game.default', game.default);
    gameInfo = { ...game.default };
    sendLatest(socket);
  } catch (error) {
    console.error('Error loading the JSON file:', error);
  }
}

function sendLatest(socket) {
  socket.emit('latest', gameInfo);
}

function makeRandomMove(fen) {
  const game = new Chess(fen);

  const possibleMoves = game.moves();
  if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  return game.fen();
}
