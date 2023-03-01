import pgConn from "./connection";

export default async function messagesActions() {
  return {
    getMessages(gameId: string) {
      return pgConn.query("SELECT * FROM messages WHERE gameId = $1 ", [
        gameId,
      ]);
    },
    addMessage(text: string, gameId: string) {
      return pgConn.query(
        "INSERT INTO messages (text, gameId) VALUES ($1, $2)",
        [text, gameId]
      );
    },
  };
}
