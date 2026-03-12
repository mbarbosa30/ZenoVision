import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlockProps {
  variant?: "dark" | "light" | "accent" | "green";
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const styles = {
  dark: "bg-[#1a1a1a] text-white border-[#2d2d2d]",
  light: "bg-white text-[#1a1a1a] border-[#e5e5e5]",
  accent: "bg-[#3b82f6] text-white border-[#2563eb]",
  green: "bg-[#059669] text-white border-[#047857]",
};

export const Block = ({ variant = "dark", children, className = "", delay = 0 }: BlockProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`border p-6 md:p-8 ${styles[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};
