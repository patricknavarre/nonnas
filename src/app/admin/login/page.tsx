"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState("");
  
  // Check if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      setDebug("Already authenticated, redirecting to admin dashboard...");
      router.push('/admin');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDebug("");
    setLoading(true);

    if (!username || !password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      setDebug(`Submitting credentials for ${username}...`);
      
      // Use NextAuth signIn method
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false
      });
      
      setDebug(prev => `${prev}\nReceived response: ${JSON.stringify(result)}`);
      
      if (!result?.ok) {
        setError(result?.error || "Invalid username or password");
        setLoading(false);
        return;
      }

      setDebug(prev => `${prev}\nLogin successful, redirecting to admin dashboard...`);
      router.push("/admin");
      
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred. Please try again.");
      setDebug(`Login error: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <Image
            src="/images/NonnaAndRues.jpg"
            alt="Nonna & Rue's"
            width={90}
            height={90}
            className="rounded-full"
          />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-southern-brown">
          Admin Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-southern-green sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-southern-green sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-southern-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-southern-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-southern-green disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {debug && (
          <div className="mt-6 p-4 bg-gray-100 text-xs font-mono whitespace-pre-wrap rounded">
            <div className="font-bold mb-2">Debug Info:</div>
            {debug}
          </div>
        )}
      </div>
    </div>
  );
} 