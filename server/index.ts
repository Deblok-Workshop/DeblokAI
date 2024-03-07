import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

new Elysia()
  .use(staticPlugin({ prefix: "/", assets: "./static" })) // dont cd into /server
  .listen(process.env.PORT || 8080);

console.log(`Listening on port ${process.env.PORT || 3000} or`);
console.log(` │ 0.0.0.0:${process.env.PORT || 3000}`);
console.log(` │ 127.0.0.1:${process.env.PORT || 3000}`);
console.log(` └─────────────────────────>`);