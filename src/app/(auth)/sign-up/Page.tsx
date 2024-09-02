"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import {  useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/schemas/signupSchema";
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
import { Loader2 } from "lucide-react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 500);

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          )
          console.log(response.data.message);
          let message = response.data.message
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      console.log(data);
      toast({
        title: " Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("error in sign up of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: " signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className=" flex justify-center items-center min-h-screen bg-gray-200">
        <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className=" text-center">
            <h1 className=" text-2xl text-orange-600 font-extrabold tracking-tight lg:text-3xl mb-6">
              Join Mystery Box
            </h1>
            <p className=" mb-4"> Sign up to start your anonymous adventure</p>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                       
                      </FormControl>
                      { isCheckingUsername && <Loader2 className=" animate-spin"/> }
                      <p className={` text-sm ${usernameMessage === "username is unique" ? ' text-green-500' : ' text-red-500'} `}>
                        test {usernameMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email"
                          {...field}
                          
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                          
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                 {
                   isSubmitting ? (
                    <>
                    <Loader2 className=" mr-2 h-4 w-4 animate-spin" /> please wait..
                    </>
                   ) : ( 'Signup')
                 }
                  </Button>
              </form>
            </Form>
            <div className=" text-center mt-4">
              <p>
                Already a member?{' '}
                <Link href="/sign-in" className=" text-blue-600 hover:text-blue-800">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
