"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { DarkModeToggle } from "@/components/features/DarkModeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            AI Fitness Coach
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}

