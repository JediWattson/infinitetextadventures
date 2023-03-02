import pgCLient from "./connection";

export default async function messagesActions() {
  return {
    async getMessages(gameId: string) {
      const pgConn = await pgCLient();
      return pgConn.query("SELECT * FROM messages WHERE gameId = $1 ", [
        gameId,
      ]);
    },
    async addMessage(gameId: string, gameType: string, speaker: string, text: string) {
      const pgConn = await pgCLient();
      return pgConn.query(
        "INSERT INTO messages (gameId, gameType, speaker, text) VALUES ($1, $2, $3, $4)",
        [gameId, gameType, speaker, text]
      );
    },
  };
}
