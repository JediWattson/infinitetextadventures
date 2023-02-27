import styles from "./styles.module.css";

function Loading() {
  const { chip, chip1, chip0 } = styles;
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.chipContainer}>
        <div className={`${chip} ${chip0}`} />
        <div className={`${chip} ${chip1}`} />
        <div className={chip} />
      </div>
      <p className={styles.text}>Determining your time of sunrise!</p>
    </div>
  );
}

export default Loading;
