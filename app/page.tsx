import Header from "@/components/header";
import style from "./page.module.css";

export default function Home() {
  return (
    <>
      <div className={style.container}>
        <h2>Welcome to my Infinite Text Adventures!</h2>
        <p>
          Feel free to sign in and create a game to try out my approach to making text adventures :D
        </p>
      </div>
    </>
  );
}
