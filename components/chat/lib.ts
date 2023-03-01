export const postOracle = async (gameId: string, text: string) => {
    const res = await fetch(`/game/${gameId}/api`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
  
    if (res.status >= 400) throw Error(`Server response status ${res.status}`);
  
    const data = await res.json();
    // speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));
    
    return data.text;
  };

  export const getOracle = async (gameId: string) => {
    const res = await fetch(`/game/${gameId}/api`);
    const data: [{ text: string }] = await res.json();
    return data.map((l) => l.text)
  }