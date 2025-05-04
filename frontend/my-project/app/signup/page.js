"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!res.ok) {
        throw new Error('Signup failed');
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-indigo-950 p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-400">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                required
                type="text"
                name="name"
                placeholder="Full Name"
                className="bg-slate-800/50 border-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                required
                type="email"
                name="email"
                placeholder="Email"
                className="bg-slate-800/50 border-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                required
                type="password"
                name="password"
                placeholder="Password"
                className="bg-slate-800/50 border-purple-500/20"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
