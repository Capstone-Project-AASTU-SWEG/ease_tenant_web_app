"use client";

import React, { ReactNode } from "react";
import { Group } from "./group";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  description?: string;
  rightSection?: ReactNode;
  leftSection?: ReactNode;
  withBackButton?: boolean;
};

const PageHeader = ({
  title,
  description,
  rightSection,
  leftSection,
  withBackButton = false,
}: Props) => {
  const router = useRouter();
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-10 bg-white"
    >
      <Group className="py-4" justify="between">
        <Group>
          {leftSection}
          {withBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeft />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-slate-500">{description}</p>
          </div>
        </Group>

        {rightSection}
      </Group>
    </motion.header>
  );
};

export default PageHeader;
