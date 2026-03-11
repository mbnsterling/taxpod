"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "~/lib/utils";
import {
  scaleInItemVariants,
  staggerContainerVariants,
} from "~/lib/motion";

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className }: StaggerGridProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={scaleInItemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
