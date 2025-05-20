import { useState } from 'react';
import hands from "../consts/hands.js";
import styles from "./ButtonsComponent.module.css";

export default function ButtonsComponent({ setGameState, gameState }) {
  const [selectedHand, setSelectedHand] = useState(null);

  const getComputerHand = () => {
    const handsArray = [hands.rock, hands.paper, hands.scissors];
    return handsArray[Math.floor(Math.random() * 3)];
  };

  const handleButtonClick = (handType) => {
    setSelectedHand(handType);
    const computerHand = getComputerHand();
    
    setGameState({
      playerHand: handType,
      computerHand
    });
  };

  return (
    <div className={styles["button-component"]}>
      {Object.values(hands).map((hand) => (
        <button
          key={hand.name}
          className={styles["choice-button"]}
          onClick={() => handleButtonClick(hand)}
          data-hand={hand.name}
        >
          <span>{hand.emogi}</span>
        </button>
      ))}
    </div>
  );
}