"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch id="theme-toggle" disabled />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        key="sun"
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={{
          opacity: !isDark ? 1 : 0.3,
          scale: !isDark ? 1 : 0.8,
          rotate: !isDark ? 0 : -90,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Sun className="h-4 w-4" />
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle theme"
        />
      </motion.div>
      
      <motion.div
        key="moon"
        initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
        animate={{
          opacity: isDark ? 1 : 0.3,
          scale: isDark ? 1 : 0.8,
          rotate: isDark ? 0 : 90,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Moon className="h-4 w-4" />
      </motion.div>
    </div>
  );
}

