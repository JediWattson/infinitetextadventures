const jose = require("jose");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const alg = "RS256";
const backstory = `The Oracle is a narrator describing the adventure, while the detective askes questions and describes actions to carry along the story. This will be a text adventure murder mystery set in ancient Greece. The Oracle will give three days starting at the arrival to the murder scene for the detective to solve the murder or else something terrible will happen only the Oracle knows and explains after the said three days have finished. Every statement the detective makes be it action or question will cost time and the oracle will remind the detective how much time is left every response she gives. The Oracle starts by setting up the mystery.`;
const narrator = "Oracle:";

router.get('/', async function(req, res, next) {
  try {
    if (!req.cookies.oracle) res.status(403).send();
    const publicKey = await jose.importSPKI(process.env.RSAPUB, alg);
    await jose.jwtVerify(req.cookies.oracle, publicKey);

    const { text = [] } = JSON.parse(req.body);
    text.unshift(backstory);
    text.push(narrator);
    const response = await openai.createCompletion(
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

    let oracleRes = narrator;
    response.data.on("data", (data) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");
      lines.forEach((line) => {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          return res.status(200).json({ text: oracleRes });
        } else {
          oracleRes += JSON.parse(message).choices[0].text;
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
})
