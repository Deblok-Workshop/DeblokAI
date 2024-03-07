import OpenAI from "openai";
const env = {
    "OPENAI_API_KEY":process.env.API_KEY || "", 
    "OPENAI_BASE_URL":process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/"

}
const openai = new OpenAI();
openai.apiKey = env.OPENAI_API_KEY;
openai.baseURL = env.OPENAI_BASE_URL;

async function generate(model:string,messages:Object,prompt:Object) {
 let msgs:any = [{ role: "system", content: `${prompt ? prompt : "You are a helpful assistant called DeblokAI."}` }];
 Object.assign({1: messages},msgs)
 let c = await openai.chat.completions.create({
    messages: msgs,
    model: "gpt-3.5-turbo",
  });
  console.log(msgs)
  return c.choices[0];
}


export default {
    generate:generate
    
}