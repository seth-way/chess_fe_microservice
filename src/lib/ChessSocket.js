import { io } from 'socket.io-client';

export default function ChessSocket(gameId) {
  const socket = io('https://chess-game-be-fmpc.onrender.com/', {
    transports: ['websocket'], // Force the use of WebSockets only
    query: {
      gameId,
    },
  });

  socket.connect();
  return socket;
}

function getURL() {
  const base = import.meta.env.VITE_SOCKET_URL;
  const port = import.meta.env.VITE_SOCKET_PORT;

  return base + (port ? `:${port}` : '');
}
