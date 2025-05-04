"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-indigo-950 p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-400">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Loading..." : "Login"}
            </Button>
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
