import { io } from 'socket.io-client';

export default function ChessSocket(gameId) {
  // const socket = io('https://chess-game-be-fmpc.onrender.com/', {
  const socket = io('localhost:5000/', {
    transports: ['websocket'], // Force the use of WebSockets only
    // withCredentials: false,
    query: { gameId }, // example query param
  });
  console.log('connecting to socket on game id', gameId);
  socket.connect();

  socket.makeMove = (fen, id) => {
    console.log('emitting move... id...', id);
    socket.emit('make_move', { current_fen: fen, game_id: id });
  };

  return socket;
}
