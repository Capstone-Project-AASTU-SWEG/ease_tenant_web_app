"use client";

import { useRouter } from "next/navigation";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  PenToolIcon as Tool,
  ShoppingBag,
  ChevronRight,
  LucideProps,
  Building,
  // Building2,
} from "lucide-react";
import Stack from "@/components/custom/stack";
import { Title } from "@/components/custom/title";
import { Text } from "@/components/custom/text";
import { Center } from "@/components/custom/center";
import {
  type ForwardRefExoticComponent,
  type RefAttributes,
  useEffect,
  useState,
} from "react";
import { useGetAppConfig } from "@/app/quries/useAppConfig";

// Create motion components
const MotionCard = motion(Card);
const MotionCardHeader = motion(CardHeader);
const MotionCardContent = motion(CardContent);
const MotionCardFooter = motion(CardFooter);
const MotionTitle = motion(CardTitle);

const TitleSection = ({
  mounted,
  titleVariants,
  subtitleVariants,
}: {
  mounted: boolean;
  titleVariants: Variants;
  subtitleVariants: Variants;
}) => (
  <Stack
    justify="center"
    align="center"
    spacing="sm"
    className="relative z-10 mb-12"
  >
    <motion.div
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
      variants={titleVariants}
    >
      <div className="relative">
        <Title
          size="h1"
          className="text-5xl font-bold tracking-tight md:text-6xl"
        >
          Create Your Account
        </Title>
        <motion.div
          className="absolute -right-6 -top-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 5,
              ease: "easeInOut",
            }}
          >
            <Building className="h-6 w-6 text-primary" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
    <motion.div
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
      variants={subtitleVariants}
      className="max-w-md"
    >
      <Text variant="dimmed" className="text-center text-lg">
        Select the type of account you want to create
      </Text>
    </motion.div>
  </Stack>
);

const UserTypeCard = ({
  type,
  onSelect,
  itemVariants,
  iconVariants,
  index,
  isFocused,
  onFocus,
  isSelected,
}: {
  type: {
    id: string;
    title: string;
    description: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    color: string;
    borderColor: string;
    hoverBorderColor: string;
    iconBg: string;
    iconColor: string;
    buttonGradient: string;
  };
  onSelect: (id: string) => void;
  itemVariants: Variants;
  iconVariants: Variants;
  index: number;
  isFocused: boolean;
  onFocus: () => void;
  isSelected: boolean;
}) => {
  const Icon = type.icon;

  return (
    <MotionCard
      variants={itemVariants}
      custom={index}
      layout
      onClick={() => !isFocused && onFocus()}
      whileHover={
        !isFocused
          ? {
              scale: 1.05,
              transition: {
                duration: 0.2,
                type: "spring",
              },
            }
          : {}
      }
      animate={
        isSelected
          ? {
              scale: [1, 1.05, 1],
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transition: { duration: 0.4 },
            }
          : isFocused
            ? {
                scale: 1,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }
            : {
                scale: 0.9,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }
      }
      className={`group relative border-2 backdrop-blur-md ${type.borderColor} transition-all duration-300 ${
        type.color
      } cursor-pointer overflow-hidden rounded-lg ${isFocused ? "w-full max-w-xl" : "w-[120px] md:w-[150px]"}`}
      style={{
        zIndex: isFocused ? 10 : 5 - index,
      }}
    >
      {/* Background gradient effect */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: "100% 100%" }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
        }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${type.iconColor.replace("text-", "var(--")})/5%, transparent 60%)`,
          backgroundSize: "200% 200%",
        }}
      />

      <MotionCardHeader className={`${isFocused ? "pt-8" : "p-4"}`}>
        <div
          className={`flex ${isFocused ? "flex-col" : "flex-col"} items-center gap-4`}
        >
          <motion.div
            className={`rounded-full ${type.iconBg} ${isFocused ? "p-5" : "p-3"} shadow-lg`}
            variants={iconVariants}
            layout
            whileHover={
              isFocused
                ? {
                    scale: 1.1,
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 0.5 },
                  }
                : {}
            }
          >
            <Icon
              className={`${isFocused ? "h-[3.5rem] w-[3.5rem]" : "h-6 w-6"} ${type.iconColor}`}
            />
          </motion.div>

          <MotionTitle
            className={`${isFocused ? "text-2xl" : "text-sm [writing-mode:vertical-rl]"} font-bold`}
            layout
          >
            {type.title}
          </MotionTitle>
        </div>
      </MotionCardHeader>

      {isFocused && (
        <>
          <MotionCardContent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <CardDescription className="mx-auto min-h-[60px] text-center text-base">
              {type.description}
            </CardDescription>
          </MotionCardContent>
          <MotionCardFooter
            className="pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <motion.div
              className="flex w-full items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className={`group relative px-8 ${type.buttonGradient} overflow-hidden rounded-full font-medium shadow-md transition-all duration-300 hover:shadow-lg`}
                onClick={() => onSelect(type.id)}
              >
                <motion.span
                  className="relative z-10 flex items-center"
                  whileHover={{ x: -4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Sign up as {type.title}
                  <motion.div
                    className="ml-2"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </motion.span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{
                    background: `linear-gradient(90deg, transparent, ${type.iconColor.replace(
                      "text-",
                      "var(--",
                    )})}/10%, transparent)`,
                  }}
                />
              </Button>
            </motion.div>
          </MotionCardFooter>
        </>
      )}
    </MotionCard>
  );
};

const userTypes = [
  {
    id: "tenant",
    title: "Tenant",
    description:
      "Sign up as a tenant to manage your rental properties and communicate with your property manager.",
    icon: Home,
    color: "bg-gradient-to-br from-primary/5 to-primary/20",
    borderColor: "border-primary/30",
    hoverBorderColor: "group-hover:border-primary/60",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    buttonGradient: "bg-gradient-to-r from-primary to-primary/80",
  },
  {
    id: "maintainer",
    title: "Maintenance Staff",
    description:
      "Sign up as maintenance staff to receive and respond to maintenance requests.",
    icon: Tool,
    color: "bg-gradient-to-br from-amber-500/5 to-amber-500/20",
    borderColor: "border-amber-500/30",
    hoverBorderColor: "group-hover:border-amber-500/60",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
    buttonGradient: "bg-gradient-to-r from-amber-500 to-amber-500/80",
  },
  {
    id: "provider",
    title: "Service Provider",
    description:
      "Sign up as a marketplace service provider to offer services to property managers and tenants.",
    icon: ShoppingBag,
    color: "bg-gradient-to-br from-emerald-500/5 to-emerald-500/20",
    borderColor: "border-emerald-500/30",
    hoverBorderColor: "group-hover:border-emerald-500/60",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-500",
    buttonGradient: "bg-gradient-to-r from-emerald-500 to-emerald-500/80",
  },
  // {
  //   id: "manager",
  //   title: "Property Manager",
  //   description:
  //     "Register as a property manager to oversee properties, manage tenants, and streamline building operations.",
  //   icon: Building2,
  //   color: "bg-gradient-to-br from-indigo-500/5 to-indigo-500/20",
  //   borderColor: "border-indigo-500/30",
  //   hoverBorderColor: "group-hover:border-indigo-500/60",
  //   iconBg: "bg-indigo-500/20",
  //   iconColor: "text-indigo-500",
  //   buttonGradient: "bg-gradient-to-r from-indigo-500 to-indigo-500/80",
  // },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: i * 0.1,
    },
  }),
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.5, type: "spring" },
  },
};

export default function SignupSelector() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [focusedType, setFocusedType] = useState<string>("tenant"); // Default to tenant
  const appConfig = useGetAppConfig().data;

  let users = userTypes;

  if (appConfig?.isMaintenaceStaffSignUpOpen === false) {
    users = users.filter((u) => u.id !== "maintainer");
  }

  if (appConfig?.isServiceProvidersSignUpOpen === false) {
    users = users.filter((u) => u.id !== "provider");
  }

  // Enable animations after mount to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectUserType = (type: string) => {
    setSelectedType(type);

    // Animate before navigation
    setTimeout(() => {
      router.push(`/auth/sign-up?type=${type}`);
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Center className="z-10 mx-auto flex h-screen max-w-6xl flex-col px-6 py-10">
        <TitleSection
          mounted={mounted}
          titleVariants={titleVariants}
          subtitleVariants={subtitleVariants}
        />

        <motion.div
          className="flex w-full justify-center py-8"
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="relative flex w-full max-w-xl justify-center gap-4">
            <AnimatePresence>
              {users.map((type, index) => (
                <UserTypeCard
                  key={type.id}
                  type={type}
                  onSelect={handleSelectUserType}
                  itemVariants={itemVariants}
                  iconVariants={iconVariants}
                  index={index}
                  isFocused={focusedType === type.id}
                  onFocus={() => setFocusedType(type.id)}
                  isSelected={selectedType === type.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12"
        >
          <Text variant="dimmed" className="text-center text-base">
            Already have an account?{" "}
            <motion.span
              whileHover={{
                color: "var(--primary)",
                transition: { duration: 0.2 },
              }}
            >
              <a
                href="/auth/sign-in"
                className="relative font-medium text-primary/90 hover:text-primary"
              >
                <span className="relative z-10">Sign in</span>
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/70"
                  initial={{ width: "100%", scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </motion.span>
          </Text>
        </motion.div>
      </Center>
    </div>
  );
}
