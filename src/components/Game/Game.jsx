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
  outcome: '',
  champion: '',
  // need to track if game over status came from server or local.
  resultsReceived: false,
};

const Game = ({ gameId, playerId }) => {
  const [game, setGame] = useState(null);
  const [gameData, setGameData] = useState(defaultGameData);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [opponentName, setOpponentName] = useState("Unknown-Player")

  useEffect(() => {
    if (gameId) {
      const chessSocket = new ChessSocket(gameId);

      chessSocket.on('connect_error', err => {
        console.error(err);
        setError(true);
      });

      chessSocket.on('latest', latest => {
        if (error) setError(() => false);
        if (
          latest.current_fen !== gameData.currentFen &&
          !gameData.resultsReceived
        ) {
          const latestGame = new Chess(latest.current_fen);
          setGame(() => latestGame);
          setGameData(prev => ({
            ...prev,
            currentFen: latest.current_fen,
            previousFen: latest.previous_fen,
            turnColor: latest.turn_color,
            whitePlayerId: latest.white_player_id,
            blackPlayerId: latest.black_player_id,
            playerColor:
              playerId === latest.white_player_id ? 'white' : 'black',
            outcome: latest.game_outcome,
            champion: latest.game_champion,
            resultsReceived: latest.game_complete,
          }));
        }
      });

      setSocket(chessSocket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, playerId]);

  useEffect(() => {
    const { outcome, champion, resultsReceived } = gameData;
    if (outcome && outcome.length && !resultsReceived) {
      socket.emit('end_game', {
        game_id: gameId,
        current_fen: game.fen(),
        game_outcome: outcome,
        game_champion: champion,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData.outcome, gameData.champion, gameData.resultsReceived]);
  // ** --> Hook only for dev 'switch player id' use case.
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
  // <-- **
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(() => gameCopy);
    return result;
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
    const gameComplete = checkGameCompletion(game);
    if (!gameComplete) socket.makeMove(game.fen(), gameId);
    return true;
  }

  function checkGameCompletion(currentGame) {
    if (currentGame.game_over()) {
      if (currentGame.in_draw()) {
        setGameData(prev => ({ ...prev, outcome: 'draw' }));
      } else if (currentGame.in_stalemate()) {
        setGameData(prev => ({ ...prev, outcome: 'stalemate' }));
      } else if (currentGame.in_checkmate()) {
        setGameData(prev => ({
          ...prev,
          outcome: 'checkmate',
          champion:
            game.turnColor === 'white'
              ? gameData.whitePlayerId
              : gameData.blackPlayerId,
        }));
      }
      return true;
    }
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
      position={game.fen()}
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
