import OpenAI from "openai";
const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/",
};
const openai = new OpenAI();
openai.apiKey = env.OPENAI_API_KEY;
openai.baseURL = env.OPENAI_BASE_URL;

async function generate(model: string, messages: Object, prompt: Object) {
  let msgs: any = [];
  //console.log(messages)
  msgs.push({"role":"system","content":`${prompt ? prompt : "You are a helpful assistant called DeblokAI."}`});
  const keys = Object.keys(messages);
  for (let i = 0; i < keys.length; i++) {
    const role = keys[i] as keyof typeof messages;
    const content = messages[role];
    msgs.push(content);
  }
  //console.log("msgs")
  //console.log(msgs);
  let c = await openai.chat.completions.create({
    messages: msgs,
    model: model || "gpt-3.5-turbo",
  });
  //console.log("got response");
  
  return c.choices;
}

export default {
  generate: generate,
};
