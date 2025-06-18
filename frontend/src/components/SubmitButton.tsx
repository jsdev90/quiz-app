import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, Sparkles } from "lucide-react";
import { Status } from "../types";

interface SaveButtonProps {
  text?: {
    idle?: string;
    loading?: string;
    success?: string;
  };
  className?: string;
  onClick: () => void;
  status: Status;
  bounce: boolean;
}

export function Button({
  text = {
    idle: "Idle",
    loading: "Loading...",
    success: "Success!",
  },
  className,
  onClick,
  bounce,
  status = Status.Idle
}: SaveButtonProps) {

  useEffect(() => {
    if (status === Status.Success) {
    }
    }, [status]);

  const buttonVariants = {
    idle: {
      backgroundColor: "rgb(64, 64, 64)",
      color: "white",
      scale: 1,
    },
    loading: {
      backgroundColor: "rgb(59, 130, 246)",
      color: "white",
      scale: 1,
    },
    success: {
      backgroundColor: "rgb(34, 197, 94)",
      color: "white",
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.2,
        times: [0, 0.5, 1],
      },
    },
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  };

  return (
    <div className="relative">
      <motion.button
        onClick={onClick}
        animate={status}
        variants={buttonVariants}
        className={`group relative grid overflow-hidden rounded-full px-6 py-2 transition-all duration-200",
          status === "idle"
            ? "shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset]"
            : "",
          "hover:shadow-lg
          ${className}
        `}
        whileHover={status === "idle" ? { scale: 1.05 } : {}}
        whileTap={status === "idle" ? { scale: 0.95 } : {}}
      >
        {status === "idle" && (
          <span>
            <span
              className={`
                spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full
                [mask:linear-gradient(black,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,black_360deg)]
                before:rotate-[-90deg] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]
              `}
            />
          </span>
        )}
        <span
          className={`
            backdrop absolute inset-px rounded-[22px] transition-colors duration-200
            ${
              status === "idle"
                ? "bg-gray-900 group-hover:bg-gray-800"
                : ""
            }
          `}
        />
        <span className="z-10 flex items-center justify-center gap-2 p-2 text-base font-medium">
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.span
                key="loading"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  rotate: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1,
                    ease: "linear",
                  },
                }}
              >
                <Loader2 className="w-4 h-4" />
              </motion.span>
            )}
            {status === Status.Success && (
              <motion.span
                key={Status.Success}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Check className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {status === "idle"
              ? text.idle
              : status === "loading"
              ? text.loading
              : text.success}
          </motion.span>
        </span>
      </motion.button>
      <AnimatePresence>
        {bounce && (
          <motion.div
            className="absolute top-0 right-0 -mr-1 -mt-1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={sparkleVariants}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
