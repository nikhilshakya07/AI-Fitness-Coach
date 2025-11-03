"use client";

import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 px-4 md:h-16 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2 md:px-0">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by Nikhil
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Fitness Coach. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

