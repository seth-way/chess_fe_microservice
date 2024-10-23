import './Game.css';
import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import ChessSocket from '../../lib/ChessSocket';
import Loading from '../Loading/Loading';
import LoadError from '../LoadError/LoadError';
import GameInfo from '../GameInfo/GameInfo';

const defaultGameData = {
  playerColor: 'white',
  turnColor: 'white',
  turnNumber: 1,
  whitePlayerId: '',
  blackPlayerId: '',
  currentFen: '',
  previousFen: '',
  complete: false,
  champion: '',
  draw: false,
};

const Game = ({ gameId, playerId }) => {
  const [game, setGame] = useState(null);
  const [gameData, setGameData] = useState({});
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [playerColor, setPlayerColor] = useState("white")
  const [opponentName, setOpponentName] = useState("Unknown-Player")

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
        updateGameFromFen(game_data.current_fen)
      })

      chessSocket.on('latest', latest => {
        setGame(new Chess(latest.current_fen));
        setGameData(prev => ({
          ...prev,
          currentFen: latest.current_fen,
          previousFen: latest.previous_fen,
          turnColor: latest.turn_color,
          turnNumber: latest.turn_number,
          whitePlayerId: latest.white_player_id,
          blackPlayerId: latest.black_player_id,
          playerColor: playerId === latest.white_player_id ? 'white' : 'black',
        }));
      });
      setSocket(chessSocket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, playerId]);
  // check for game complete on game updates
  useEffect(() => {
    if (game) {
      setGameData(prev => ({
        ...prev,
        complete: game.game_over(),
        draw: game.in_draw(),
      }));
    }
  }, [game]);
  // --> Hook only for dev 'switch player id' use case.
  useEffect(() => {
    if (gameData.whitePlayerId) {
      const newColor = playerId === gameData.whitePlayerId ? 'white' : 'black';
      // check prevents infinite rerender loop.
      if (gameData.playerColor !== newColor) {
        setGameData(prev => ({
          ...prev,
          playerColor: newColor,
        }));
      }
    }
  }, [playerId, gameData]);
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
    const { turnColor, playerColor } = gameData;
    if (turnColor !== playerColor) return;
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
    socket.emit('make_move', { current_fen: game.fen(), game_id: gameId });
    return true;
  }

  return error ? (
    <LoadError />
  ) : game ? (
    <div className='chess-service'>
    <GameInfo 
      turnColor = {gameData.turnColor} 
      opponentName = {opponentName} 
      complete ={gameData.complete}
      draw = {gameData.draw}
      champion = {gameData.champion}
      turnNumber = {gameData.turnNumber}
    />
    <Chessboard
      position={game.fen()}Í
      onPieceDrop={onDrop}
      boardOrientation={gameData.playerColor}
      customDarkSquareStyle={{
        backgroundColor: '#4E98D9',
      }}
      customLightSquareStyle={{
        backgroundColor: '#CEE1F2',
      }}
    />
    </div>
  ) : (
    <Loading />
  );
};

export default Game;
