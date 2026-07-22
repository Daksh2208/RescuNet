"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";



export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "accessToken",
        res.data.accessToken
      );

      const userRole = String(res.data.user?.role || res.data.role || "citizen").toLowerCase();
      
      if (userRole === "citizen") {
        router.push("/citizen");
      } else if (userRole === "rescue") {
        router.push("/rescue");
      } else if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "volunteer") {
        router.push("/volunteer");
      } else {
        router.push("/citizen");
      }
    } catch (err: any) {

      alert(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }

  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 group w-fit mx-auto">
          <ShieldAlert className="h-10 w-10 text-red-600 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-3xl text-slate-900">
            ResQ<span className="text-red-600">Net</span>
          </span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{" "}
          <Link href="/register" className="font-medium text-red-600 hover:text-red-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-red-600 hover:text-red-500 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                disabled={loading}
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                {
                  loading
                    ?
                    "Signing In..."
                    :
                    "Sign In"
                }
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-700">Need help?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
