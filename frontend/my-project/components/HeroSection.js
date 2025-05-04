import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="pt-24 md:pt-32 relative">
      <div className="container flex flex-col items-center text-center gap-8 pb-12">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
          Create, Share, and Collaborate on Digital Art
        </h1>
        <p className="text-xl text-muted-foreground max-w-[42rem]">
          Experience the future of digital art creation. Powerful tools for artists, 
          designers, and creative minds.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="text-lg">
            Start Creating
          </Button>
          <Button size="lg" variant="outline" className="text-lg">
            Watch Demo
          </Button>
        </div>
        <div className="relative w-full max-w-5xl aspect-video mt-8 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/dashboard-preview.png"
            alt="Doodles App Interface"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
