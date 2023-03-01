import pgCLient from "./connection";

export default async function messagesActions() {
  return {
    async getMessages(gameId: string) {
      const pgConn = await pgCLient();
      return pgConn.query("SELECT * FROM messages WHERE gameId = $1 ", [
        gameId,
      ]);
    },
    async addMessage(userId: string, gameId: string, text: string) {
      const pgConn = await pgCLient();
      return pgConn.query(
        "INSERT INTO messages (userId, gameId, text) VALUES ($1,  $2, $3)",
        [userId, gameId, text]
      );
    },
  };
}
