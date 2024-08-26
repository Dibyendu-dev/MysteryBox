import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
    await dbConnect()

    try {
        const { searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result= UsernameQuerySchema.safeParse(queryParam)
        console.log(result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success:false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'invaild query parameters'
                },
                { status :400}
            )
        }

        const { username}=result.data

        const existingVarifiedUser = await UserModel.findOne({ username , isVarified:true})

        if(existingVarifiedUser){
            return Response.json(
                {
                    success:false,
                    message: 'username is already taken'
                },
                { status :400})
            }

            return Response.json(
                {
                    success:true,
                    message: 'username is unique'
                },
                { status :400})

    } catch (error) {
        console.log("error checking username" , error)
        return Response.json(
            {
                success:false,
                message: "error checking username"
            },
            { status :500}
        )
    }
}