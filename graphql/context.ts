import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@/prisma/generated/prisma";
import { User } from "next-auth";


export type Context = {
    prisma : PrismaClient
    user : User | null
}

export async function createContext(): Promise<Context> {
    const session = await auth()
    const user = session?.user;
    console.log("session : ",session)
    return {
        prisma,
        user : user || null
    }
}