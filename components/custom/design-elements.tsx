import React from "react";
import { motion } from "framer-motion";

const BackgroundDots = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed right-0 top-0 -z-[99] h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-0 left-0 -z-[99] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
      />
    </>
  );
};

export { BackgroundDots };
