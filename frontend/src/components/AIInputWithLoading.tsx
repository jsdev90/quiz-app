import { CornerRightDown } from "lucide-react";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import { TextShimmer } from "./TextShimmer";

interface AIInputWithLoadingProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string) => void | Promise<void>;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
}

export function AIInputWithLoading({
  id = "ai-input-with-loading",
  placeholder = "Ask me anything!",
  minHeight = 56,
  maxHeight = 200,
  onSubmit,
  className,
  value,
  onChange,
  loading,
  setLoading,
  error,
}: AIInputWithLoadingProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const handleSubmit = async () => {
    if (!value.trim() || loading) return;

    setLoading(true);
    await onSubmit?.(value);
    onChange("");
    adjustHeight(true);
    setLoading(false);
  };

  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="relative max-w-xl w-full mx-auto flex items-start flex-col gap-2">
        <div className="relative max-w-xl w-full mx-auto">
          <textarea
            id={id}
            placeholder={placeholder}
            className={`max-w-xl bg-white/5 w-full outline-none rounded-3xl pl-6 pr-10 py-4 placeholder:text-gray-400
            border-none ring-white/30 text-gray-100 resize-none text-wrap leading-[1.2] min-h-[${minHeight}px]`}
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
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-xl py-1 px-1 ${
              loading ? "bg-none" : "bg-white/5"
            }`}
            type="button"
            disabled={loading}
          >
            {loading ? (
              <div
                className="w-4 h-4 bg-white rounded-sm animate-spin transition duration-700"
              />
            ) : (
              <CornerRightDown
                className={`w-4 h-4 transition-opacity text-white ${value ? "opacity-100" : "opacity-30"}`}
              />
            )}
          </button>
        </div>
        {loading ? (
          <TextShimmer className="font-mono mx-auto text-base text-gray-100">
            Generating quiz...
          </TextShimmer>
        ) : (
          <p className="pl-4 h-4 text-base mx-auto text-gray-300">
            {error || "Ready to generate!"}
          </p>
        )}
      </div>
    </div>
  );
}
