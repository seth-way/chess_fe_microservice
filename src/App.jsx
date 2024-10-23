import { useState } from 'react';
import './App.css';
import Game from './components/Game/Game';

const games = [1, 2, 3, 4, 5];

function App() {
  console.log('<><> APP LOADED <><>');
  const [gameId, setGameId] = useState(1);
  const [playerId, setPlayerId] = useState(1);

  const handleClick = e => {
    if (e.target.value === 'player') {
      setPlayerId(Number(e.target.id));
    } else {
      setGameId(Number(e.target.id));
    }
  };

  return (
    <>
      <div className='game-area'>
        <Game gameId={gameId} playerId={playerId} />
      </div>
      <div className='buttons'>
        <button
          onClick={handleClick}
          id={1}
          value='player'
          className={playerId === 5 ? 'active' : ''}
        >
          White
        </button>
        <button
          onClick={handleClick}
          id={2}
          value='player'
          className={playerId === 6 ? 'active' : ''}
        >
          Black
        </button>
        <button
          onClick={handleClick}
          id='1111'
          value='game'
          className={gameId === '1111' ? 'active' : ''}
        >
          G 1
        </button>
        <button
          onClick={handleClick}
          id='2222'
          value='game'
          className={gameId === '2222' ? 'active' : ''}
        >
          G 2
        </button>
        <button
          onClick={handleClick}
          id='3333'
          value='game'
          className={gameId === '3333' ? 'active' : ''}
        >
          G 3
        </button>
        <button
          onClick={handleClick}
          id='4444'
          value='game'
          className={gameId === '4444' ? 'active' : ''}
        >
          G 4
        </button>
        <button
          onClick={handleClick}
          id='5555'
          value='game'
          className={gameId === '5555' ? 'active' : ''}
        >
          G 5
        </button>
      </div>
    </>
  );
}

export default App;
