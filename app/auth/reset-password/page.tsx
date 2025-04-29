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
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";
import { CustomButton } from "@/components/custom/button";
// import { Button } from "@/components/ui/button";
// import { errorToast, successToast } from "@/components/custom/toasts";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email(),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SignInSchema>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const handleSubmit = (values: SignInSchema) => {
    console.log({ values });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/verify");
    }, 500);
  };

  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-[30rem] px-6">
          <Stack className="mb-6" spacing="sm">
            <Title>Reset Password</Title>
            <Text variant="dimmed" className="font-light">
              Enter your email to access account
            </Text>
          </Stack>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Stack>
                <FormField<SignInSchema>
                  type="email"
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Email"
                  classNames={{
                    input: "h-10",
                  }}
                />
              </Stack>

              <Stack className="mt-8">
                <CustomButton
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Get PIN
                </CustomButton>
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
    </main>
  );
};

export default SignIn;
