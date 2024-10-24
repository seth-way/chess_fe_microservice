import './GameInfo.css'
function GameInfo({turnColor, opponentName, outcome, champion, turnNumber}){
    //uncomment below to manually test gameStates other than turn color.
        // outcome = 'draw'
        // outcome = 'checkmate'
        // outcome = 'stalemate'
        // champion = 'Player 1'
    let gameState;
    if (outcome){
        if(outcome === 'draw' || outcome === 'stalemate'){
            gameState = `Game complete: ${outcome}`
        }
        else {
            gameState = `Game complete by ${outcome}, ${champion} won.`;
        }
    } else {
        gameState = `Current turn: ${turnNumber}, ${turnColor} to move.`;
    };
    return(
        <ul className="game-info">
            <h2 className='opponent-info'>Game with: {opponentName}</h2>
            <li className='turn-info'>{gameState}</li>
        </ul>
    );
};

export default GameInfo;