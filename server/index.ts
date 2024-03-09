import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import ai from "./ai.ts";
const server = new Elysia();

server.use(staticPlugin({ prefix: "/", assets: "./static" })); // dont cd into /server
server.listen(process.env.PORT || 3000);

const global_prompt:string = process.env.GLOBAL_PROMPT || `You are a helpful assistant called DeblokAI. Respond informally and be very concise (minimum 6 words, maximum 250 words) unless you are told otherwise. You may use emojis and markdown when needed, but only use emojis sparingly (limit 1 emoji per message).`;

server.onError(({ code, error }) => {
  console.log(code,error)
  return error
})

const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || undefined,
};

if (!env.OPENAI_API_KEY) {
  console.error("error: No API key present! Exiting.");
  process.exit(1);
}

server.get("/api", ({ set }) => {
  set.redirect = "https://img.rare1k.dev/_broken_links.gif";
});
server.get("/api/", ({ set }) => {
  set.redirect = "https://img.rare1k.dev/_broken_links.gif";
});

server.post("/api/completions", async ({ set, body }) => {
  let b: any = body; // elysia bug
  try {
    b = JSON.parse(b);
  } catch {
    set.status = 400;
    return { error: "Invalid JSON" };
  }
  b.model = b.model ? b.model : "gpt-3.5-turbo";
  b.prompt = b.prompt
    ? b.prompt
    : global_prompt;
  let r: any = await ai.generate(b.model, b.messages, b.prompt); // unsure what typeof but its ok
  return r;
});

server.post("/api/chat", async ({ set, body }) => {
  // console.log("got req")
  let b: any = body; // elysia bug
  try {
    b = JSON.parse(b);
  } catch {
    set.status = 400;
    return { error: "Invalid JSON" };
  }
  b.model = b.model ? b.model : "gpt-3.5-turbo";
  b.prompt = b.prompt
    ? b.prompt
    : global_prompt;
  try {
  let r: any = await ai.generate(b.model, b.messages, b.prompt);
  return r[0].message.content;
  } catch (e:any) {
    if (e.ai_err) {
      set.status = 400; return "Model is not availiable.";
    }
    else {set.status = 500; return e;}
  }
});
server.get("/api/models", async ({ set, body }) => {
  return ai.getModels().split(",");
});

console.log(`Listening on port ${process.env.PORT || 3000} or`);
console.log(` │ 0.0.0.0:${process.env.PORT || 3000}`);
console.log(` │ 127.0.0.1:${process.env.PORT || 3000}`);
console.log(` └─────────────────────────>`);
