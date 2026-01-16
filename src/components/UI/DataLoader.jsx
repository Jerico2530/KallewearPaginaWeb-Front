
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
const DataLoader = ({
  isLoading,
  isError,
  data,
  loader = null,
  errorComponent = null,
  fallback = null,
  children,
}) => {
  if (isLoading) return loader;
  if (isError) return errorComponent;
  if (!data) return fallback;

  return (
    <AnimatePresence>
      <motion.div
        key={JSON.stringify(data)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children(data)}
      </motion.div>
    </AnimatePresence>
  );
};

export default DataLoader;
