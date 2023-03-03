import { Stream } from "stream";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function streamCompletetion(prompt: string) {
  const completion: any = await openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt,
      stream: true,
      max_tokens: 230,
      stop: ["\n"],
      temperature: 0.8,
      frequency_penalty: 0.7,
    },
    { responseType: "stream" }
  );

  return new Promise<string>((resolve, reject) => {
    let string = "";
    completion.data.on("data", (data: ReadableStream) => {
      try {
        data
          .toString()
          .split("\n")
          .filter((line) => line.trim() !== "")
          .forEach((line) => {
            const message = line.replace(/^data: /, "");
            if (message === "[DONE]") {
              if (string === "") reject("Empty string sent");
              resolve(string);
            } else {
              string += JSON.parse(message).choices[0].text;
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function streamToJSON(stream: ReadableStream) {
  const reader = stream.getReader();
  let decoder = new TextDecoder("utf-8");

  const result = await reader.read();
  return JSON.parse(decoder.decode(result.value));
}
