import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  return (
    <motion.div
      className="fixed left-6 top-6 z-[999]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:shadow-lg dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
        variant="ghost"
        onClick={() => router.push("/auth/sign-up")}
      >
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 md:text-white/50 md:group-hover:-translate-x-0.5 md:group-hover:text-white" />
          </div>
          <span className="text-sm font-medium text-primary transition-colors duration-300 md:text-white/50 md:group-hover:text-white">
            Return to Sign Up
          </span>
        </div>
      </Button>
    </motion.div>
  );
};

export default BackButton;
