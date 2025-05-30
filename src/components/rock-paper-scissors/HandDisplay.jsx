import { useEffect, useState } from 'react';
import styles from "@/assets/css/rock-paper-scissors/HandDisplay.module.css";
import clsx from 'clsx';

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
        <div className={clsx(styles["hand-choice"], animate ? styles["player-hand"] : '')}>
          {playerHand}
        </div>
        <p className={styles.label}>You</p>
      </div>
      <div className={styles.vs}>VS</div>
      <div className="computer-section">
        <div className={clsx(styles["hand-choice"], animate ? styles["computer-hand"] : '')}>
          {computerHand}
        </div>
        <p className={styles.label}>Computer</p>
      </div>
    </div>
  );
};

export default HandDisplay;
