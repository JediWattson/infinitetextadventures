import style from "./style.module.css";

export default function Home() {
  return (
    <div className={style.container}>
      <h2>
        Welcome to <br />
        Infinite Text Adventures!
      </h2>
      <p>
        all you need to do is sign in then create a game
        <br />
        try out approach to making text adventures :D
      </p>
    </div>
  );
}
