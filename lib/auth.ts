import  NextAuth, { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { googleClientId, googleClientSecret } from "./config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import bycrypt from 'bcryptjs'




if (!googleClientId || !googleClientSecret) {
    
    throw new Error("GOOGLE_CLIENT_ID Or GOOGLE_CLIENT_SECRET Not in the env")
}



export const authOptions : NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session : {strategy : 'jwt'},
  pages : {
    signIn : "/login"
  },
  providers: [
  
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials ) {
        const validateData = LoginSchema.safeParse(credentials);
        if (!validateData.success) return null;

        const { email, password } = validateData.data;

        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bycrypt.compare(password, user.password);
        if (!passwordMatch) return null; 

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image : user.image ?? null
        };
      }
    }),
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

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth(authOptions);

