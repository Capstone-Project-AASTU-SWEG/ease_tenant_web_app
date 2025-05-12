import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.98 },
};

type Props = { isSubmitting: boolean };

const SubmitButton = ({ isSubmitting }: Props) => (
  <motion.button
    type="submit"
    className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-primary to-primary/80 px-6 py-2 text-primary-foreground shadow-md"
    disabled={isSubmitting}
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
  >
    <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
    <Sparkles className="h-4 w-4" />
  </motion.button>
);

export default SubmitButton;
