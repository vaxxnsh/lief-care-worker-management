"use client";

import { signIn } from "next-auth/react";

export async function googleAuthenticate() {
    try {
      await signIn('google',{
        redirect: true,
        callbackUrl:'/'
      });
    } catch (error) {
      console.log(error)
      if (error) {
        return 'google log in failed'
      }
      throw error;
    }
}