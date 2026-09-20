'use client';

import { useActionState, useState } from 'react';
import { adminLoginAction, AdminLoginState } from './actions';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AdminLoginState, FormData>(
    adminLoginAction,
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Card */}
      <div className="bg-[#1C1817] border border-[#382F2D] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C5A265]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#5C1D24]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center relative z-10 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2A2321] border border-[#453A37] text-[#C5A265] mb-4 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F8F5F0] tracking-tight">
            Naqash Gallery
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C5A265] font-semibold mt-1">
            Administrator Gateway
          </p>
          <p className="text-xs text-[#A39A95] mt-2">
            Restricted access. Authorized personnel only.
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5 relative z-10">
          <div>
            <label 
              htmlFor="email" 
              className="block text-xs font-semibold uppercase tracking-wider text-[#D5CDC5] mb-2"
            >
              Administrator Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F79]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@naqashcarpets.com"
                className="w-full pl-10 pr-4 py-3 bg-[#13100F] border border-[#3E3432] rounded-xl text-[#F8F5F0] placeholder-[#6E645F] text-sm focus:outline-none focus:border-[#C5A265] focus:ring-1 focus:ring-[#C5A265] transition-colors"
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-semibold uppercase tracking-wider text-[#D5CDC5] mb-2"
            >
              Security Key / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F79]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[#13100F] border border-[#3E3432] rounded-xl text-[#F8F5F0] placeholder-[#6E645F] text-sm focus:outline-none focus:border-[#C5A265] focus:ring-1 focus:ring-[#C5A265] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A7F79] hover:text-[#D5CDC5] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A265] to-[#D4B37F] text-[#13100F] font-semibold text-sm tracking-wide uppercase hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C5A265]/10 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-[#13100F] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Unlock Admin Access</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-[#2F2725] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#A39A95] hover:text-[#C5A265] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Naqash Gallery</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
