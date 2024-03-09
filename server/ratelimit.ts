  export default {
    duration: 300 * 1000,
    max: 20,
    responseMessage: "Global rate limit reached.",
    skip: (req: any) => {
      return !new URL(req.url).pathname.startsWith("/api");
    }
  }