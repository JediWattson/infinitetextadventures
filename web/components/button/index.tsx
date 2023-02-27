import styles from "./styles.module.css";

type ButtonPropsType = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  large?: boolean;
};

function Button({ large, text, onClick, disabled }: ButtonPropsType) {
  return (
    <button
      disabled={disabled}
      className={`${styles.buttonContainer} ${
        disabled ? styles.disabled : ""
      } ${large ? styles.large : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
