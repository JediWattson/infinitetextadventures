import type { NextApiRequest } from "next";
import type { Stream } from "stream";
import { NextResponse } from "next/server";


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const backstory = `The Oracle is a narrator describing the adventure, while the detective askes questions and describes actions to carry along the story. This will be a text adventure murder mystery set in ancient Greece. The Oracle will give three days starting at the arrival to the murder scene for the detective to solve the murder or else something terrible will happen only the Oracle knows and explains after the said three days have finished. Every statement the detective makes be it action or question will cost time and the oracle will remind the detective how much time is left every response she gives. The Oracle starts by setting up the mystery.`;
const narrator = "Oracle:";

async function streamToJSON(stream: ReadableStream) {
  const reader = stream.getReader()
  let decoder = new TextDecoder('utf-8');

  const result = await reader.read()
  return JSON.parse(decoder.decode(result.value));
}

async function streamToString(stream: Stream) {
  return new Promise((resolve, reject) => {
    let string = ''
    stream.on("data", (data: ReadableStream) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");
      lines.forEach((line) => {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          resolve(string);
        } else {
          string += JSON.parse(message).choices[0].text;
        }
      });
    });

  })
}

const res = NextResponse;
export async function POST(req: NextApiRequest) {
    try {
        const { text = [] } =  await streamToJSON(req.body);
        text.unshift(backstory);
        text.push(narrator);
        
        const completeion = await openai.createCompletion(
          {
            model: "text-davinci-003",
            prompt: text.join("\n"),
            stream: true,
            max_tokens: 230,
            stop: ["\n"],
            temperature: 0.8,
            frequency_penalty: 0.7,
          },
          { responseType: "stream" }
        );
    
        const oracleRes = await streamToString(completeion.data);
        return res.json({ text: narrator + oracleRes });
      } catch (error) {
        console.error(error);        
        res.json({ status: 500});
      }
}
