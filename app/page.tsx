"use client";
import useLocation from "@/hooks/useLocation";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  const {loading,location,error} = useLocation();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        Image is {session?.user?.image} <br />
        <button onClick={() => signOut()}>Sign out </button>
        <br/>
        {
          <span>{error ? error : loading ? "Loading..." : `lat : ${location?.lat} long : ${location?.long}` }</span> 
        }
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
