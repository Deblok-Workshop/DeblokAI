import OpenAI from "openai";
const env = {
    "API_KEY":process.env.API_KEY || "", 
    "OPENAI_BASE":process.env.OPENAI_BASE || "https://api.openai.com/v1/"

}
const openai = new OpenAI();
openai.apiKey = env.API_KEY;
openai.baseURL = env.OPENAI_BASE;

async function generate(model:string,messages:Object,prompt:Object) {
 let c = await openai.chat.completions.create({
    messages: [{ role: "system", content: `${prompt ? prompt : "You are a helpful assistant called DeblokAI."}` }],
    model: "gpt-3.5-turbo",
  })
  return c.choices[0];
}