"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description?: string;
  children?: ReactNode;
};

const PageBanner = ({ title, description, children }: Props) => {
  return (
    <div className="relative z-10 mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 px-6 py-12 text-white shadow-xl md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mb-6 max-w-2xl text-lg text-white/90 md:text-xl">
          {description}
        </p>
        {children}
      </motion.div>
    </div>
  );
};

export default PageBanner;
