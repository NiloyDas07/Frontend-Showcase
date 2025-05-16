import { useEffect, useState } from 'react';
import styles from "./HandDisplay.module.css";

const HandDisplay = ({ playerHand, computerHand }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation when hands change
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [playerHand, computerHand]);

  return (
    <div className={styles["hand-selection-container"]}>
      <div className="player-section">
        <h1 className={`${styles["player-hand"]} ${animate ? styles["player-hand-animate"] : ''}`}>
          {playerHand}
        </h1>
        <p className="player-label">You</p>
      </div>
      <div className="vs">VS</div>
      <div className="computer-section">
        <h1 className={`${styles["computer-hand"]} ${animate ? styles["computer-hand-animate"] : ''}`}>
          {computerHand}
        </h1>
        <p className="computer-label">Computer</p>
      </div>
    </div>
  );
};

export default HandDisplay;
