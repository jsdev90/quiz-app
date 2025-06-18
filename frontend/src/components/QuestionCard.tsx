import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Question } from "../types";
import { NeonCheckbox } from "./AnimatedCheckBox";

export const QuestionCard = ({
  items,
  className,
  answers,
  handleChange,
}: {
  items: Question[];
  answers: Record<number, string>;
  handleChange: (id: number, value: string) => void;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`grid grid-cols-1 py-10 ${className}`}>
      {items.map((item, idx) => (
        <div
          key={item?.id}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-600/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{`${item.id}. ${item.question}`}</CardTitle>
            <CardDescription>
              {item.choices.map((choice) => (
                <div
                  key={choice?.trim()}
                  className="relative flex items-center rounded-md px-3 space-x-2 py-2  hover:bg-gray-700 hover:bg-opacity-10"
                >
                  <NeonCheckbox
                    onChange={() => handleChange(item.id, choice)}
                    checked={answers[item.id] === choice}
                  />
                  <strong className="text-gray-300 text-base pl-2">
                    {choice}
                  </strong>
                </div>
              ))}
            </CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`rounded-2xl h-full w-full p-4 overflow-hidden bg-gray-900 border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 ${className}`}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={`text-gray-300 text-xl font-bold tracking-wide ${className}`}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`mt-4 text-gray-400 tracking-wide leading-relaxed text-sm ${className}`}
    >
      {children}
    </div>
  );
};
