import React from "react";
import { motion } from "framer-motion";

// Animation Variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.98 },
};

interface Tab {
  id: string;
  title: string;
  icon: React.ElementType; // Generic icon component type
  color?: string; // Optional color class for the icon
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string; // Optional custom class for styling
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}) => {
  console.log(...tabs, activeTab);
  return (
    <div className={`mb-8 flex ${className}`}>
      <div className="relative flex items-center justify-between rounded-full bg-background/50 p-1">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center">
            <motion.button
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial="initial"
            >
              {React.createElement(tab.icon, {
                className: `h-4 w-4 ${tab.color || ""}`,
              })}
              <span>{tab.title}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 -z-10 rounded-full bg-white"
                  layoutId="activeTabBackground"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
            </motion.button>
            {index < tabs.length - 1 && (
              <div className="mx-1 h-[1px] w-4 bg-border opacity-50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
