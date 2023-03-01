import pgCLient from "./connection";

export default async function messagesActions() {
  return {
    async getMessages(gameId: string) {
      const pgConn = await pgCLient();
      return pgConn.query("SELECT * FROM messages WHERE gameId = $1 ", [
        gameId,
      ]);
    },
    async addMessage(text: string, gameId: string) {
      const pgConn = await pgCLient();
      return pgConn.query(
        "INSERT INTO messages (text, gameId) VALUES ($1, $2)",
        [text, gameId]
      );
    },
  };
}
