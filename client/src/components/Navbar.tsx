"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm border-b border-slate-200 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <ShieldAlert className="h-8 w-8 text-red-600 transition-transform group-hover:scale-110" />
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                ResQ<span className="text-red-600">Net</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#modules" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Modules
            </Link>
            <Link href="#ai" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              AI Powered
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
            >
              Register / Report
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full border-b border-slate-200 py-4 flex flex-col space-y-4 px-4 shadow-lg">
          <Link
            href="#features"
            className="text-base font-medium text-slate-600 hover:text-slate-900 block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#modules"
            className="text-base font-medium text-slate-600 hover:text-slate-900 block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Modules
          </Link>
          <Link
            href="#ai"
            className="text-base font-medium text-slate-600 hover:text-slate-900 block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            AI Powered
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            <Link
              href="/login"
              className="text-base font-medium text-slate-600 hover:text-slate-900 block w-full text-center py-2 border border-slate-200 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-base font-medium bg-red-600 text-white block w-full text-center py-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register / Report
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
