import { useEffect, useState } from 'react';
import styles from "./TextChoiceDisplay.module.css";

const TextChoiceDisplay = ({ playerChoice, computerChoice }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation when choices change
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [playerChoice, computerChoice]);

  return (
    <div className={styles["text-choice-display"]}>
      <Selection 
        player="You" 
        choice={playerChoice} 
        animate={animate}
      />
      <Selection 
        player="Computer" 
        choice={computerChoice} 
        animate={animate}
      />
    </div>
  );
};

export default TextChoiceDisplay;

function Selection({ player, choice, animate }) {
  return (
    <div className={`${styles.choice} ${animate ? styles["choice-animate"] : ''}`}>
      <h3>{player} Chose</h3>
      <h1>{choice || '-'}</h1>
    </div>
  );
}
