import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import ai from "./ai.ts"
const server = new Elysia()

server.use(staticPlugin({ prefix: "/", assets: "./static" })) // dont cd into /server
server.listen(process.env.PORT || 3000);

const env = {
    "OPENAI_API_KEY":process.env.OPENAI_API_KEY, 
    "OPENAI_BASE_URL":process.env.OPENAI_BASE_URL || undefined

}

if (!env.OPENAI_API_KEY) {console.error("error: No API key present! Exiting.");process.exit(1)}

server.post("/api/generate",({ set,body }) => {
    let b:any = body; // elysia bug
    try {
    b = JSON.parse(b)
    } catch {
        set.status = 400;
        return {"error":"Invalid JSON"}
    }
    b.model = b.model ? b.model : "gpt-3.5-turbo";
    b.prompt = b.prompt ? b.prompt : "You are a helpful assistant called DeblokAI.";
    return ai.generate(b.model,b.messages,b.prompt)
})

console.log(`Listening on port ${process.env.PORT || 3000} or`);
console.log(` │ 0.0.0.0:${process.env.PORT || 3000}`);
console.log(` │ 127.0.0.1:${process.env.PORT || 3000}`);
console.log(` └─────────────────────────>`);