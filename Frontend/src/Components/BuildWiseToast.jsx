// BuildWiseToast.jsx
// Drop-in replacement — fully custom render, no react-hot-toast default styling involved.

import toast, { Toaster, resolveValue } from "react-hot-toast";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const ICONS = {
  success: (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.2 11.5L13 4.5" stroke="#0A0A0A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <path d="M4 4L12 12M12 4L4 12" stroke="#F0F0F0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function ToastCard({ t, variant, message, meta }) {
  const isSuccess = variant === "success";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{
        opacity: t.visible ? 1 : 0,
        y: t.visible ? 0 : -8,
        scale: t.visible ? 1 : 0.97,
      }}
      transition={{ duration: 0.28, ease: EASE }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={() => toast.dismiss(t.id)}
      style={{
        position: "relative",
        width: 340,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 16px",
        borderRadius: 14,
        background: "#171717",
        border: `1px solid ${isSuccess ? "rgba(110,231,183,0.18)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: isSuccess
          ? "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(110,231,183,0.05), 0 0 24px rgba(110,231,183,0.06)"
          : "0 20px 50px rgba(0,0,0,0.5)",
        cursor: "pointer",
        overflow: "hidden",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      {/* glass reflection — diagonal sheen, very faint */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 35%)",
          pointerEvents: "none",
        }}
      />

      {/* icon */}
      <div
        style={{
          flexShrink: 0,
          width: 24,
          height: 24,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isSuccess ? "#6EE7B7" : "rgba(255,255,255,0.1)",
          boxShadow: isSuccess
            ? "0 0 0 5px rgba(110,231,183,0.1), 0 0 18px rgba(110,231,183,0.45)"
            : "none",
        }}
      >
        {ICONS[variant]}
      </div>

      {/* text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontSize: 13.5,
            lineHeight: 1.4,
            fontWeight: 500,
            color: "#F0F0F0",
            letterSpacing: "-0.01em",
          }}
        >
          {message}
        </span>
        {meta && (
          <span
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 10.5,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.02em",
            }}
          >
            {meta}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export const bwToast = {
  success: (message, opts = {}) =>
    toast.custom((t) => <ToastCard t={t} variant="success" message={message} meta={opts.meta} />, {
      duration: 3200,
      ...opts,
    }),
  error: (message, opts = {}) =>
    toast.custom((t) => <ToastCard t={t} variant="error" message={message} meta={opts.meta} />, {
      duration: 4200,
      ...opts,
    }),
};

export function BuildWiseToaster() {
  return (
    <Toaster position="top-right" gutter={10} containerStyle={{ top: 24, right: 24 }}>
      {(t) => resolveValue(t.message, t)}
    </Toaster>
  );
}

/* Usage:
   <BuildWiseToaster />   // once, near app root, replaces your current <Toaster />

   bwToast.success("User logged in successfully");
   bwToast.error("Couldn't log in");
*/
