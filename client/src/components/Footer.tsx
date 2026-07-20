

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <ShieldAlert className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl text-slate-900">
                ResQ<span className="text-red-600">Net</span>
              </span>
            </Link>
            <p className="text-slate-600 text-sm mb-6">
              Empowering communities and authorities with AI-driven human and animal disaster management.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                X (Twitter)
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link></li>
              <li><Link href="#modules" className="hover:text-slate-900 transition-colors">Modules</Link></li>
              <li><Link href="#ai" className="hover:text-slate-900 transition-colors">AI & Analytics</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Safety Guidelines</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">API Documentation</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Partner Program</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} ResQNet Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Status:</span>
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
