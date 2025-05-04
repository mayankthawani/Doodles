"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, ListTodo, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0118]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/10 backdrop-blur-md border-b border-white/5 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Doodles
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['About', 'Features', 'Join Us'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-gray-300 hover:text-indigo-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-indigo-400">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent -z-10" />
        <div className="container px-4 pt-20">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-400">
              Organize Your Tasks,
              <br />
              Elevate Your Life
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your daily workflow with our intuitive task management solution. 
              Stay organized, boost productivity, and achieve more.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-lg h-12 px-8">
                Start Now
              </Button>
              <Button variant="outline" className="text-lg h-12 px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-black/30">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Why Choose Doodles?
              </h2>
              <p className="text-gray-400 text-lg">
                Doodles is more than just a task manager. It&apos;s your personal productivity companion 
                designed to help you achieve your goals with ease and style.
              </p>
              <div className="space-y-4">
                {[
                  "Intuitive and user-friendly interface",
                  "Smart task organization and categorization",
                  "Real-time progress tracking",
                  "Customizable workflows"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-indigo-400 h-5 w-5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-3xl" />
          <Image
                src="/app-preview.png" 
                alt="App Preview"
                className="relative rounded-xl border border-white/10 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400">
              Everything you need to manage tasks effectively and boost your productivity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <ListTodo className="h-6 w-6" />,
                title: "Smart Task Management",
                description: "Organize tasks with intelligent categorization"
              },
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "Calendar Integration",
                description: "Seamless scheduling and deadline tracking"
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Time Analytics",
                description: "Insights into your productivity patterns"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-black/30 border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-600/10 flex items-center justify-center mb-4 text-indigo-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section id="join-us" className="py-24 bg-black/30">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of users who are already boosting their productivity with Doodles.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg h-12 px-8">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
