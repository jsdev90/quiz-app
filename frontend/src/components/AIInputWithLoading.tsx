import { CornerRightDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import { TextShimmer } from "./TextShimmer";

interface AIInputWithLoadingProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  loadingDuration?: number;
  thinkingDuration?: number;
  onSubmit?: (value: string) => void | Promise<void>;
  className?: string;
  autoAnimate?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function AIInputWithLoading({
  id = "ai-input-with-loading",
  placeholder = "Ask me anything!",
  minHeight = 56,
  maxHeight = 200,
  loadingDuration = 3000,
  thinkingDuration = 1000,
  onSubmit,
  className,
  autoAnimate = false,
  value,
  onChange
}: AIInputWithLoadingProps) {
  const [submitted, setSubmitted] = useState(autoAnimate);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runAnimation = () => {
      if (!autoAnimate) return;
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, thinkingDuration);
      }, loadingDuration);
    };

    if (autoAnimate) {
      runAnimation();
    }

    return () => clearTimeout(timeoutId);
  }, [autoAnimate, loadingDuration, thinkingDuration]);

  const handleSubmit = async () => {
    if (!value.trim() || submitted) return;

    setSubmitted(true);
    await onSubmit?.(value);
    onChange("");
    adjustHeight(true);

    setTimeout(() => {
      setSubmitted(false);
    }, loadingDuration);
  };

  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="relative max-w-xl w-full mx-auto flex items-start flex-col gap-2">
        <div className="relative max-w-xl w-full mx-auto">
          {/* <div className="relative group rounded-3xl bg-gradient-to-r from-gray-800 via-indigo-500 to-gray-800 animate-border"> */}
            <textarea
              id={id}
              placeholder={placeholder}
              className={`max-w-xl bg-black/5 dark:bg-white/5 w-full outline-none rounded-3xl pl-6 pr-10 py-4 placeholder:text-black/70 dark:placeholder:text-white/70
              border-none ring-black/30 dark:ring-white/30 text-black dark:text-white resize-none text-wrap leading-[1.2] min-h-[${minHeight}px]`}
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                adjustHeight();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={submitted}
            />
          {/* </div> */}
          <button
            onClick={handleSubmit}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-xl py-1 px-1 ${
              submitted ? "bg-none" : "bg-black/5 dark:bg-white/5"
            }`}
            type="button"
            disabled={submitted}
          >
            {submitted ? (
              <div
                className="w-4 h-4 bg-black dark:bg-white rounded-sm animate-spin transition duration-700"
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <CornerRightDown
                className={`w-4 h-4 transition-opacity dark:text-white ${value ? "opacity-100" : "opacity-30"}`}
              />
            )}
          </button>
        </div>
        {submitted ? (
          <TextShimmer
            className="font-mono mx-auto text-base text-gray-100"
            duration={1}
          >
            Generating quiz...
          </TextShimmer>
        ) : (
          <p className="pl-4 h-4 text-base mx-auto text-gray-300">
            Ready to generate!
          </p>
        )}
      </div>
    </div>
  );
}
