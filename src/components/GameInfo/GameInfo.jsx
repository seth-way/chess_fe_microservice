import './GameInfo.css'
function GameInfo({turnColor, opponentName, complete, draw, champion, turnNumber}){
    //uncomment below to manually test gameStates other than turn color.
        // complete = true
        // draw = true
        // champion = 'Player 1'
    let gameState;
    if (complete){
        draw?
        gameState = 'Game complete: draw.'
        :gameState = `Game complete: ${champion} won.`;
    } else {
        gameState = `Current turn: ${turnNumber}, ${turnColor} to move.`;
    };
    return(
        <ul className="game-info">
            <li className='opponent-info'>Game with: {opponentName}</li>
            <li className='turn-info'>{gameState}</li>
        </ul>
    );
};

export default GameInfo;