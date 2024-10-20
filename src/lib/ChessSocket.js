import { io } from 'socket.io-client';

export default function ChessSocket(gameId) {
  const socket = io(`localhost:5000/?q=${gameId}`, { query: { gameId } });
  console.log(socket)
  socket.connect();
  return socket;
}

function getURL() {
  const base = import.meta.env.VITE_SOCKET_URL;
  const port = import.meta.env.VITE_SOCKET_PORT;

  return base + (port ? `:${port}` : '');
}
