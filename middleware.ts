import {authOptions} from "./lib/auth"
import NextAuth from "next-auth"
 
const { auth } = NextAuth(authOptions)

export default auth(async (req) =>  {
  const user = req.auth?.user;
  const url = req.nextUrl.pathname;
  console.log("pathName was : ",url)
  console.log("user was : ", user?.name || "not present")
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}