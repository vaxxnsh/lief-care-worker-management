import  { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { googleClientId, googleClientSecret } from "./config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"



if (!googleClientId || !googleClientSecret) {
    throw new Error("GOOGLE_CLIENT_ID Or GOOGLE_CLIENT_SECRET Not in the env")
}



export const authOptions : AuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Credentials({
        

    // }),
    GoogleProvider({
    clientId: googleClientId!,
    clientSecret: googleClientSecret!,
    authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }

    })
  ],
}

