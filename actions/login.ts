'use server';

import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/lib/auth";
import z from "zod";

export const login = async (data : z.infer<typeof LoginSchema>) => {
    const validateData = LoginSchema.safeParse(data);

    if(!validateData.success) {
        return { error : "Invalid inputs data"}
    }

    const {email, password} = validateData.data;
    

    try{
        const userExist = await prisma.user.findFirst({
            where : {
                email : email,
            }
        });

        if(!userExist) {
            return {error : "User not found"}
        }

        if (!userExist.password) {
            return {error : "Password not set"}
        }


        await signIn("credentials",{
            email : email,
            password : password,
            redirect : false,
        })

        return { success : "logged in successfully"}
    }
    catch(error) {
        console.log(error)
       console.log(typeof error)
       return {error : "couldn't sign in"}
    }
}