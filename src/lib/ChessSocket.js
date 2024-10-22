import { io } from 'socket.io-client';

export default function ChessSocket(gameId) {
  const socket = io('http://127.0.0.1:5000', {
    transports: ['websocket'], // Force the use of WebSockets only
    // withCredentials: false,
    query: {
      gameId, // example query param
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
