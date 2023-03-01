import styles from "./styles.module.css";

type ButtonPropsType = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  large?: boolean;
  small?: boolean;
};

function Button({ large, text, onClick, disabled, small }: ButtonPropsType) {
  return (
    <button
      disabled={disabled}
      className={`${styles.buttonContainer} ${small ? styles.small : ""} ${
        disabled ? styles.disabled : ""
      } ${large ? styles.large : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
