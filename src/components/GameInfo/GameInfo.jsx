import './GameInfo.css'
function GameInfo({turnColor, opponentName, complete, draw, champion}){
    //uncomment below to manually test gameStates other than turn color.
        // complete = true
        // draw = true
        // champion = 'Player 1'
    let gameState;
    console.log(complete, draw, champion)
    if (complete){
        draw?
        gameState = 'Game complete: draw.'
        :gameState = `Game complete: ${champion} won.`;
    } else {
        gameState = turnColor;
    };
    return(
        <ul className="game-info">
            <li>Game with: {opponentName}</li>
            <li>{gameState}</li>
        </ul>
    );
};

export default GameInfo;