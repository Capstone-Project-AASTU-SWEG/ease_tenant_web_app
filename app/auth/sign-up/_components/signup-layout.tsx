"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

// Create motion components
const MotionCard = motion(Card);
const MotionCardHeader = motion(CardHeader);
const MotionCardContent = motion(CardContent);
const MotionCardFooter = motion(CardFooter);
const MotionCardTitle = motion(CardTitle);
const MotionCardDescription = motion(CardDescription);

interface SignupLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  userType: string;
}

export default function SignupLayout({
  title,
  description,
  children,
  userType,
}: SignupLayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Enable animations after mount to prevent hydration issues
  console.log({ userType });
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen px-6">
      {/* Decorative background elements */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/auth/sign-up"
          className="my-6 flex items-center text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ x: -6 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </motion.div>
          Back to account types
        </Link>
      </motion.div>

      <section className="mx-auto max-w-5xl">
        <AnimatePresence>
          {mounted && (
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.1,
              }}
              className="border-none shadow-none"
            >
              <MotionCardHeader
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <MotionCardTitle
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-2xl text-transparent"
                >
                  {title}
                </MotionCardTitle>
                <MotionCardDescription
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-md"
                >
                  {description}
                </MotionCardDescription>
              </MotionCardHeader>

              <MotionCardContent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {children}
              </MotionCardContent>

              <MotionCardFooter
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-col space-y-4"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Already have an account?{" "}
                  <motion.span
                    whileHover={{ color: "var(--primary)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/auth/sign-in"
                      className="font-medium text-primary underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </motion.span>
                </motion.div>
              </MotionCardFooter>
            </MotionCard>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
