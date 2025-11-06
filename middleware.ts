export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*"], // protect all routes under /admin
};
