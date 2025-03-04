"use client";

import Image from "next/image";
import React, { useState } from "react";
import ASSETS from "../_assets";
import { Stack } from "@/components/custom/stack";
import { Title } from "@/components/custom/title";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/custom/form-field";
import { Text } from "@/components/custom/text";
import { Button } from "@/components/ui/button";
import { ArrowRight, TvIcon } from "lucide-react";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth-client";
import { errorToast, successToast } from "@/components/custom/toasts";
import { CustomButton } from "@/components/custom/button";
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Wrong confirmation password.",
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const handleSubmit = (values: SignUpSchema) => {
    signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          router.push("/sign-in");
          setTimeout(() => {
            successToast("You signed up successfully.");
          }, 400);
        },
        onError: (ctx) => {
          errorToast("Error signing up: " + ctx.error.message);
          setIsLoading(false);
        },
      },
    });
  };

  const handleGoogleSignOn = () => {
    signIn.social({
      provider: "google",
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          router.push("/");
          setTimeout(() => {
            successToast("You signed up successfully.");
          }, 400);
        },
        onError: (ctx) => {
          errorToast("Error signing up: " + ctx.error.message);
          setIsLoading(false);
        },
      },
    });
  };
  return (
    <main>
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr]">
        {/* Rightside registration form */}
        <div className="flex h-screen items-center justify-center">
          {/* Form container */}
          <div className="w-full max-w-[30rem] px-6">
            <Stack className="mb-6" spacing="sm">
              <Title>Get Started Now</Title>
              <Text variant="dimmed" className="font-light">
                Enter your crendentials to create account
              </Text>
            </Stack>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Stack>
                  <FormField<SignUpSchema>
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Name"
                    classNames={{
                      input: "h-10",
                    }}
                  />
                  <FormField<SignUpSchema>
                    type="email"
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Email"
                    classNames={{
                      input: "h-10",
                    }}
                  />
                  <FormField<SignUpSchema>
                    type="password"
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Password"
                    classNames={{
                      input: "h-10",
                    }}
                  />
                  <FormField<SignUpSchema>
                    type="password"
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    classNames={{
                      input: "h-10",
                    }}
                  />
                </Stack>

                <Stack className="mt-8">
                  <CustomButton
                    type="submit"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Sign Up
                  </CustomButton>

                  <div className="relative mx-auto my-3 w-2/3 border-[0.5px] border-neutral-100 text-center">
                    <small className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-neutral-500">
                      Or
                    </small>
                  </div>

                  <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    disabled={isLoading}
                    onClick={handleGoogleSignOn}
                  >
                    <TvIcon />
                    Sign In with Google
                  </Button>

                  <Text variant="dimmed" size="sm">
                    {`If you already have an account`},{" "}
                    <Link className="text-neutral-800" href="/sign-in">
                      Sign In
                      <ArrowRight size={18} className="ml-2 inline" />
                    </Link>
                  </Text>
                </Stack>
              </form>
            </Form>
          </div>

          {/* Some Design */}
          <div className="absolute bottom-0 left-0 size-[8rem]">
            <Image
              src={ASSETS.SVGS.CIRCLE_DESIGN}
              fill
              alt="Design"
              className=""
            />
          </div>
        </div>
        {/* Leftside background image */}
        <div className="relative hidden h-screen lg:block">
          <Image
            src={ASSETS.IMAGES.BUILDING_IMAGE}
            alt="Building Image"
            className="rounded-b-2xl rounded-l-2xl object-cover"
            fill
            placeholder="blur"
          />
        </div>
      </section>
    </main>
  );
};

export default SignUp;
