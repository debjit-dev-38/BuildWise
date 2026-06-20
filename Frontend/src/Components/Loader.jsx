import { motion } from "framer-motion";

export default function Loader({
  text = "Loading...",
  fullScreen = true,
}) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative h-12 w-12"
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

      <p className="text-sm text-white/50">
        {text}
      </p>
    </div>
  );

  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-12">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A]">
      {content}
    </div>
  );
}