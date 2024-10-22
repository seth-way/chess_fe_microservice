import './Game.css';
import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import ChessSocket from '../../lib/ChessSocket';
import Loading from '../Loading/Loading';
import LoadError from '../LoadError/LoadError';

const defaultGameData = {
  playerColor: 'white',
  turn: 'white',
  whitePlayerId: '',
  blackPlayerId: '',
  currentFen: '',
  previousFen: '',
  complete: false,
  draw: false,
};

const Game = ({ gameId, playerId }) => {
  const [game, setGame] = useState(null);
  const [gameData, setGameData] = useState({});
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [playerColor, setPlayerColor] = useState("white")

  useEffect(() => {
    if (gameId) {
      const chessSocket = new ChessSocket(gameId);

      chessSocket.on('connect_error', err => {
        console.error(err);
        setError(true);
      });
      
      chessSocket.on(`game_info_${gameId}`, (game_data)=>{
        if(String(game_data.white_player_id) !== playerId){
          setPlayerColor('black')
        };
        const loadedGame = new Chess(game_data.current_fen);
        setGame(loadedGame);
      })

      chessSocket.on(`move_made_${gameId}`,(game_data)=>{
        const updatedGame = new Chess(game_data.current_fen);
        setGame(updatedGame);
      })

      chessSocket.on('latest', latest => {
        if (!game) {
          setGameData({
            whitePlayerId: latest.white_player_id,
            blackPlayerId: latest.black_player_id,
            playerColor:
              playerId === latest.white_player_id ? 'white' : 'black',
          });
        }

        setGame(new Chess(latest.current_fen));
        setGameData(prev => ({
          ...prev,
          currentFen: latest.current_fen,
          previousFen: latest.previous_fen,
          turn: latest.turn_color,
        }));
      });

      setSocket(chessSocket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, playerId]);

  // --> Hook only for dev 'switch player id' use case.
  useEffect(() => {
    if (gameData.whitePlayerId) {
      setGameData(prev => ({
        ...prev,
        playerColor: playerId === gameData.whitePlayerId ? 'white' : 'black',
      }));
    }
  }, [playerId, gameData.whitePlayerId]);
	// <--
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(() => gameCopy);
    return result;
  }

  function checkTurnFromFen(fen){
    const turn = fen.split(' ')[1]
    return playerColor.includes(turn)
  }

  function onDrop(sourceSquare, targetSquare) {
    if (!checkTurnFromFen(game.fen())){ return };
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });
    // catch illegal move
    if (move === null) return false;
    // --> game ending scenarios will need to be handled.
    if (game.game_over()) setGameData(prev => ({ ...prev, complete: true }));
    if (game.in_draw()) setGameData(prev => ({ ...prev, draw: true }));
		// <--
    socket.emit('make_move', { fen: game.fen(), game_id: gameId });
    return true;
  }

  return error ? (
    <LoadError />
  ) : game ? (
    <Chessboard
      position={game.fen()}
      onPieceDrop={onDrop}
      boardOrientation={playerColor}
    />
  ) : (
    <Loading />
  );
};

export default Game;
