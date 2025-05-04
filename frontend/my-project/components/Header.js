"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-2xl">
          Doodles
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="#gallery" className="hover:text-primary transition-colors">
            Gallery
          </Link>
        </nav>

        <div className="flex gap-4">
          <Button variant="ghost">Log in</Button>
          <Button>Sign up</Button>
        </div>
      </div>
    </header>
  );
}
