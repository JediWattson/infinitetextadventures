import Header from "@/components/header";
import style from "./page.module.css";

export default function Home() {
  return (
    <>
      <div className={style.container}>
        <h2>Welcome to my game!</h2>
        <p>
          If you want to try it out click the sign in button above and use your
          Gitlab account
        </p>
      </div>
    </>
  );
}
