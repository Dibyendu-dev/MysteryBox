import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { error } from "console";

export const authOptions: NextAuthOptions ={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any):Promise<any>{
                await dbConnect()
                try {
                   const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},

                        ]
                    })
                    if(!user){
                        throw new Error ("no user found with this email")
                    }
                    if(!user.isVarified){
                        throw new Error ("pls verify your account before login")
                    }
                   const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password)

                   if(isPasswordCorrect){
                    return user
                   }
                   else{
                    throw new Error("incorrect password")
                   }
                } catch (error:any) {
                    throw new Error(error)
                }
              }
        })

    ],
    callbacks:{
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVarified = user.isVarified;
                token.isAcceptingMessages = user.isAcceptngMessages;
                token.username = user.username;
            }
            return token
          },
        async session({ session,  token }) {
            if(token){
                session.user._id =token._id;
                session.user.isAcceptngMessages = token.isVarified;
                session.user.isAcceptngMessages = token.isAcceptngMessages;
                session.user.username = token.username
            }
            return session
          }
         
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}