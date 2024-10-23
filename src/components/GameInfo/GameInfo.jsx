import './GameInfo.css'
function GameInfo({turnColor, opponentName, complete, draw, champion}){

    let gameState;
    console.log(complete, draw, champion)
    if (complete){
        draw?
        gameState = draw
        :gameState = champion;
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