import {authOptions} from "./lib/auth"
import NextAuth from "next-auth"
import { ProtectedPages } from "./routes";
import { url } from "./lib/config";
 
const { auth } = NextAuth(authOptions)

export default auth(async (req) =>  {
  const {nextUrl } = req;
  const isAuthenticated = !!req.auth;
  console.log("Middleware called : ",nextUrl.pathname)
  console.log("user was : ", req.auth?.user?.name || "not present")

  const isApi = nextUrl.pathname.includes("/api");
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";
  const isPrivateRoute = ProtectedPages.includes(nextUrl.pathname);

  if (isApi) return;

  if (isAuthenticated && isAuthRoute) {
    return Response.redirect(`${url}/dashboard`);
  }
  if (!isAuthenticated && isPrivateRoute) {
    return Response.redirect(`${url}/login`);
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}