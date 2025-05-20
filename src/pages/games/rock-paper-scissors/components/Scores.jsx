import styles from "./Scores.module.css";

const Scores = ({ playerScore, computerScore }) => {
  return (
    <div className={styles.scores}>
      <h2>Score</h2>
      <div className={styles["score-display"]}>
        <div className={styles["score-item"]}>
          <div className={styles["score-label"]}>You</div>
          <div className={styles["score-value"]}>{playerScore}</div>
        </div>
        <div className={styles["vs-separator"]}>VS</div>
        <div className={styles["score-item"]}>
          <div className={styles["score-label"]}>Computer</div>
          <div className={styles["score-value"]}>{computerScore}</div>
        </div>
      </div>
    </div>
  );
};

export default Scores;