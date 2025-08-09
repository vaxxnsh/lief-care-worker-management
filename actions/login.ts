'use server';

import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";
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
                password : password
            }
        });

        if(!userExist || !userExist.password) {
            return {error : "User not found"}
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (userExist.password !== hashedPassword) {
            return {error : "Incorrect email or password"}
        }

        await signIn("credentials",{
            email : email,
            password : hashedPassword,
            redirect : true,
            callbackUrl : '/',
        })

        return { success : "logged in successfully"}
    }
    catch(error) {
        console.log(error)
       console.log(typeof error)
       return {error : "couldn't sign in"}
    }
}