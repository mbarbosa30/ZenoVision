import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => { document.title = "404 — Zeno Vision"; }, []);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md mx-4 border border-[#2d2d2d] bg-[#1a1a1a] p-8">
        <div className="flex mb-4 gap-3 items-center">
          <AlertCircle className="h-8 w-8 text-[#3b82f6]" />
          <h1 className="text-2xl font-semibold text-white">404</h1>
        </div>
        <p className="text-sm text-[#a0aec0] mb-6">
          This page doesn't exist.
        </p>
        <Link href="/" className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
}
