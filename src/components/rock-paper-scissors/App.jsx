import { useState, useEffect } from 'react';
import HandDisplay from "./HandDisplay";
import Scores from "./Scores";
import ButtonsComponent from "./ButtonsComponent";
import hands from "../../data/rock-paper-scissors/hands";
import "@/assets/css/rock-paper-scissors/App.css";

function App() {
  const [gameState, setGameState] = useState({
    playerHand: hands.rock,
    computerHand: hands.rock,
    playerScore: 0,
    computerScore: 0,
    gameResult: null, // 'win', 'lose', or 'draw'
  });

  // Reset game result after a delay
  useEffect(() => {
    if (gameState.gameResult) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, gameResult: null }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameResult]);

  // Update game state with animation
  const updateGameState = (newState) => {
    const result = determineGameResult(newState.playerHand, newState.computerHand);
    
    setGameState(prev => ({
      ...prev,
      ...newState,
      gameResult: result,
      playerScore: result === 'win' ? prev.playerScore + 1 : prev.playerScore,
      computerScore: result === 'lose' ? prev.computerScore + 1 : prev.computerScore
    }));
  };

  // Determine game result
  const determineGameResult = (playerHand, computerHand) => {
    if (playerHand.name === computerHand.name) return 'draw';
    return playerHand.beats === computerHand.name ? 'win' : 'lose';
  };

  return (
    <>
      <h1 className="game-title">Rock Paper Scissors</h1>
      
      {/* Game Board */}
      <div className="game-board">
        <HandDisplay
          playerHand={gameState.playerHand.emogi}
          computerHand={gameState.computerHand.emogi}
        />
        
        <Scores
          playerScore={gameState.playerScore}
          computerScore={gameState.computerScore}
        />
        
        <ButtonsComponent 
          setGameState={updateGameState} 
          gameState={gameState}
        />

        {/* Game result overlay */}
          <div className={`result-overlay ${gameState.gameResult}`}>
            {gameState.gameResult === 'win' && '🎉 You Win! 🎉'}
            {gameState.gameResult === 'lose' && '😢 You Lose! 😢'}
            {gameState.gameResult === 'draw' && '🤝 Draw! 🤝'}
          </div>
      </div>
    </>
  );
}

export default App;
