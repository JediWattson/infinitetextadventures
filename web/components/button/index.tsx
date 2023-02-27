import styles from "./styles.module.css";

type ButtonPropsType = {
  text: string;
  onClick: () => void;
  inlineHeader?: boolean;
  disabled?: boolean;
  large?: boolean;
};

function Button({ large, text, onClick, disabled, inlineHeader }: ButtonPropsType) {
  return (
    <button
      disabled={disabled}
      className={`${styles.buttonContainer} ${inlineHeader ? styles.inlineHeader : ""} ${
        disabled ? styles.disabled : ""
      } ${large ? styles.large : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
