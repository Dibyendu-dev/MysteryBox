'use client'
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"


const Navbar = () => {

    const { data: session } = useSession()  

   

    const user= session?.user as User

  return (
    <nav className="bg-gray-800 p-4 md:p-6 shadow-md">
        <div className=" container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-white font-bold text-2xl mb-4 md:mb-0" href="#">Mystery Box</a>
            {
                session ? (
                    <div>
                        <span className="text-white mr-4">Welcome ,{user?.username || user?.email}</span>
                        <Button className=" w-full m-auto" onClick={() => signOut()}>Logout</Button>
                    </div>
                ):(
                    <Link href="/sign-in">
                        <Button className="text-white w-full m-auto">Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar