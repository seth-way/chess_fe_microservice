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
        <>
        <>Game with: {opponentName}</>
        <div>{gameState}</div>
        </>
    );
};

export default GameInfo;