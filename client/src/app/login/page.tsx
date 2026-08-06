"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Users, Truck, ShieldCheck, HeartHandshake } from "lucide-react";



export default function LoginPage() {
  const [role, setRole] = useState<"citizen" | "volunteer" | "rescue" | "admin">("citizen");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("userRole");
    if (token && savedRole) {
      router.push(`/${savedRole}`);
    }
  }, [router]);

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

      // Use the role selected in the UI rather than the backend response to allow easy testing of all modules
      const userRole = role.toLowerCase();
      
      localStorage.setItem("userRole", userRole);

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
          
          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">Select your role</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === "citizen"
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <Users className={`h-6 w-6 mb-2 ${role === "citizen" ? "text-red-600" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("volunteer")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === "volunteer"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <HeartHandshake
                  className={`h-6 w-6 mb-2 ${role === "volunteer" ? "text-green-600" : "text-slate-400"
                    }`}
                />
                <span className="text-sm font-semibold">Volunteer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("rescue")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === "rescue"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <Truck className={`h-6 w-6 mb-2 ${role === "rescue" ? "text-blue-600" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">Rescue</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === "admin"
                  ? "border-purple-600 bg-purple-50 text-purple-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <ShieldCheck className={`h-6 w-6 mb-2 ${role === "admin" ? "text-purple-600" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">Admin</span>
              </button>
            </div>
          </div>

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
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === "rescue"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  : role === "volunteer"
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    : role === "admin"
                      ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
              >
                {
                  loading
                    ?
                    "Signing In..."
                    :
                    `Sign In as ${
                      role === "citizen"
                        ? "Citizen"
                        : role === "volunteer"
                          ? "Volunteer"
                          : role === "rescue"
                            ? "Rescue Team"
                            : "Administrator"
                    }`
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
