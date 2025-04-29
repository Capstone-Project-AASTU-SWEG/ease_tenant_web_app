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
// import { FormField } from "@/components/custom/form-field";
import { Text } from "@/components/custom/text";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";
import { CustomButton } from "@/components/custom/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// import { Button } from "@/components/ui/button";
// import { errorToast, successToast } from "@/components/custom/toasts";
// import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email(),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isLoading] = useState(false);
  // const router = useRouter();
  const form = useForm<SignInSchema>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const handleSubmit = (values: SignInSchema) => {
    console.log({ values });
  };

  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        {/* Form container */}
        <div className="w-full max-w-[30rem] px-6">
          <Stack className="mb-6" spacing="sm">
            <Title>Verification</Title>
            <Text variant="dimmed" className="font-light">
              Enter OTP we send you via email to reset your password.
            </Text>
          </Stack>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="align-center flex justify-center">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot className="size-[4rem] text-lg" index={0} />
                    <InputOTPSlot className="size-[4rem] text-lg" index={1} />
                    <InputOTPSlot className="size-[4rem] text-lg" index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot className="size-[4rem] text-lg" index={3} />
                    <InputOTPSlot className="size-[4rem] text-lg" index={4} />
                    <InputOTPSlot className="size-[4rem] text-lg" index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Stack className="mt-8">
                <CustomButton
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Verify
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
