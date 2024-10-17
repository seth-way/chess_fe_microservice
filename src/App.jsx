import { samplePlayerID } from '../mock_data/dummyGame';
import './App.css';
import Game from './components/Game/Game';

function App() {
  return (
    <>
    <div className="game-area"></div>
      <Game playerId={samplePlayerID}/>
    </>
  );
}

export default App;
