import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const bookingProgress = createCookie("booking", {
  maxAge: 86400, // a day
});
