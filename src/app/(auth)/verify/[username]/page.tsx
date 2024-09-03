"use client";
import { useToast } from "@/components/ui/use-toast";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Sucess",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("error in verification code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: " verification code failed",
        description: errorMessage,
        variant: "destructive",
      });
      router.replace(`/`);
    }
  };

  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-200">
      <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className=" text-2xl text-orange-600 font-extrabold tracking-tight lg:text-3xl mb-6">
            verify your account
          </h1>
          <p className=" mb-4">
            {" "}
            enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>verification code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
