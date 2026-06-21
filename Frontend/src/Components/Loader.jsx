import { motion } from "framer-motion";

export default function Loader({
  text,
  fullScreen = false,
  size = "md",
}) {
  const sizes = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const spinner = (
    <motion.div
      className={`relative ${sizes[size]}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-white/10" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6EE7B7]" />
    </motion.div>
  );

  const content = (
    <div className="flex flex-col items-center gap-2">
      {spinner}
      {text && (
        <p className="text-sm text-white/50">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A]">
        {content}
      </div>
    );
  }

  return content;
}