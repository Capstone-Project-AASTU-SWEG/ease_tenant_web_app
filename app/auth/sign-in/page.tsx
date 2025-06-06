"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import ASSETS from "../_assets";
import { Stack } from "@/components/custom/stack";
import { Title } from "@/components/custom/title";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/custom/text";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// import { signIn } from "@/lib/auth-client";
import { CustomButton } from "@/components/custom/button";
import {
  errorToast,
  successToast,
  warningToast,
} from "@/components/custom/toasts";
import { useRouter } from "next/navigation";
import {
  EmailFormField,
  PasswordFormField,
} from "@/components/custom/form-field";
import { useUserSignInMutation } from "../_queries/useAuth";
import { USER_TYPE } from "@/types";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn = () => {
  const router = useRouter();
  const form = useForm<SignInSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const userSignInMutation = useUserSignInMutation();

  const handleSubmit = (values: SignInSchema) => {
    userSignInMutation.mutate(values);
  };

  useEffect(() => {
    if (userSignInMutation.isSuccess) {
      const userData = userSignInMutation.data;
      const token = userData.token;

      localStorage.setItem("token", token);
      successToast("You signed in successfully.");
      if (userData.user.role.toLowerCase() === USER_TYPE.TENANT.toLowerCase()) {
        router.push("/dashboard/tenant");
      } else if (
        userData.user.role.toLowerCase() == USER_TYPE.MANAGER.toLowerCase()
      ) {
        router.push("/dashboard/management");
      } else if (
        userData.user.role.toLowerCase() == USER_TYPE.OWNER.toLowerCase()
      ) {
        router.push("/dashboard");
      } else {
        warningToast(userData.user.role + " is not defined role.");
      }
    }
  }, [router, userSignInMutation.data, userSignInMutation.isSuccess]);

  useEffect(() => {
    if (userSignInMutation.isError) {
      errorToast("Error signing in: " + userSignInMutation.error.message);
    }
  }, [userSignInMutation.isError, userSignInMutation.error?.message]);

  const isLoading = userSignInMutation.isPending;

  return (
    <main>
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr]">
        {/* Rightside registration form */}
        <div className="flex h-screen items-center justify-center">
          {/* Form container */}
          <div className="w-full max-w-[30rem] px-6">
            <Stack className="mb-6" spacing="sm">
              <Title>Welcome Back</Title>
              <Text variant="dimmed" className="font-light">
                Enter your crendentials to access account
              </Text>
            </Stack>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Stack>
                  <EmailFormField<SignInSchema>
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Email"
                    classNames={{
                      input: "h-10",
                    }}
                  />
                  <div className="relative">
                    <PasswordFormField<SignInSchema>
                      control={form.control}
                      name="password"
                      label="Password"
                      placeholder="Password"
                      classNames={{
                        input: "h-10",
                      }}
                    />

                    <Link
                      href="/reset-password"
                      className="absolute -top-2 right-0"
                    >
                      <small className="text-primary">Forget Password?</small>
                    </Link>
                  </div>
                </Stack>

                <Stack className="mt-8">
                  <CustomButton
                    className="rounded-md"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Sign In
                  </CustomButton>

                  <div className="relative mx-auto my-3 w-2/3 border-[0.5px] border-neutral-100 text-center">
                    <small className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-neutral-500">
                      Or
                    </small>
                  </div>

                  {/* <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    onClick={handleGoogleSignOn}
                    disabled={isLoading}
                  >
                    <TvIcon />
                    Sign In with Google
                  </Button> */}

                  <Text variant="dimmed" size="sm">
                    {`If you don't have account`},{" "}
                    <Link className="text-neutral-800" href="/auth/sign-up">
                      Sign Up
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

export default SignIn;
