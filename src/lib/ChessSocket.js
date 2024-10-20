import { io } from 'socket.io-client';

export default function ChessSocket(gameId) {
  const socket = io(getURL(), { query: { gameId } });
  socket.connect();
  return socket;
}

function getURL() {
  const base = import.meta.env.VITE_SOCKET_URL;
  const port = import.meta.env.VITE_SOCKET_PORT;

  return base + (port ? `:${port}` : '');
}
