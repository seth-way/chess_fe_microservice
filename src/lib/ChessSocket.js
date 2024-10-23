import { io } from 'socket.io-client';

export default function ChessSocket(gameId) {
  //// for deployed BE
  const socket = io('https://chess-game-be-fmpc.onrender.com/', {
  //// for local BE
  //const socket = io('localhost:5000/', {
    transports: ['websocket'], // Force the use of WebSockets only
    query: {
      gameId,
    },
  });
  
  socket.connect();

  socket.makeMove = (fen, id) => {
    socket.emit('make_move', { current_fen: fen, game_id: id });
  };

  return socket;
}
