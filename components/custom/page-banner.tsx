"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Calendar } from "lucide-react";

type Props = {
  title: string;
  description?: string;
};

const PageBanner = ({ title, description }: Props) => {
  return (
    <div className="relative z-10 px-6 py-12 text-white md:px-12">
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
        <div className="flex flex-wrap gap-4">
          <Button
            size="lg"
            className="bg-white font-medium text-primary hover:bg-white/90 hover:text-primary/90"
            onClick={() => {
              const element = document.getElementById("buildings-list");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          >
            Schedule a Tour <Calendar className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PageBanner;
