'use client'

import styles from "./styles.module.css";

function Header() {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{"Infinite Text Adventures!"}</h2>
    </div>
  );
}

export default Header;
