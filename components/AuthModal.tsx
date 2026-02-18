"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Lock, Mail, ShieldCheck, UserPlus, LogIn, ArrowRight } from "lucide-react";
import { login, register } from "@/app/actions/auth";
// Für React 18/Next 14/15 nutzen wir useFormState (oder useActionState in allerneuesten Versionen)
import { useFormState } from "react-dom"; 
import Script from "next/script";
import { useRouter } from "next/navigation";

function SekerLogo({ className }: { className?: string }) {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor"><path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/></svg>);
}

const initialState = { error: "", success: false };

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginState, loginAction] = useFormState(login, initialState);
  const [registerState, registerAction] = useFormState(register, initialState);
  
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  // Captcha Logic
  const handleReCaptcha = () => {
    if (!(window as any).grecaptcha) return;
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha.execute(siteKey, { action: mode }).then((newToken: string) => {
        setToken(newToken);
      });
    });
  };

  useEffect(() => {
    if (isOpen) {
        // Token holen beim Öffnen
        setTimeout(handleReCaptcha, 500);
    }
  }, [isOpen, mode]);

  // Handle Success Redirect
  useEffect(() => {
    if (loginState?.success || registerState?.success) {
        setPending(false);
        router.push("/dashboard"); // Client-side redirect
    }
    if (loginState?.error || registerState?.error) {
        setPending(false); // STOP SPINNER ON ERROR
    }
  }, [loginState, registerState, router]);

  if (!isOpen) return null;

  const currentAction = mode === 'login' ? loginAction : registerAction;
  const currentState = mode === 'login' ? loginState : registerState;

  const handleSubmit = (formData: FormData) => {
      setPending(true);
      handleReCaptcha(); // Refresh token
      formData.append("recaptchaToken", token); // Ensure token is attached manually if needed or via hidden input
      currentAction(formData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="afterInteractive" />
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-[#0c0c0e] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header with Tabs */}
        <div className="flex border-b border-white/5">
            <button 
                onClick={() => { setMode('login'); setPending(false); }}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'login' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                Login
            </button>
            <button 
                onClick={() => { setMode('register'); setPending(false); }}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'register' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                Register
            </button>
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2">
                <X size={18} />
            </button>
        </div>

        <div className="p-8 md:p-10 space-y-6">
            <div className="text-center space-y-2">
                <SekerLogo className="w-10 h-10 text-green-500 mx-auto" />
                <h2 className="text-xl font-black italic text-white tracking-tighter uppercase">
                    {mode === 'login' ? 'Welcome Back' : 'Join the Club'}
                </h2>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="recaptchaToken" value={token} />
                
                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-zinc-600 w-4 h-4" />
                        <input name="email" type="email" required placeholder="user@example.com" className="w-full bg-black/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-green-500 focus:outline-none transition-all" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-zinc-600 w-4 h-4" />
                        <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-green-500 focus:outline-none transition-all" />
                    </div>
                </div>

                {mode === 'register' && (
                    <div className="space-y-1 animate-in slide-in-from-top-2 fade-in">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-zinc-600 w-4 h-4" />
                            <input name="confirmPassword" type="password" required placeholder="••••••••" className="w-full bg-black/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-green-500 focus:outline-none transition-all" />
                        </div>
                    </div>
                )}

                {/* Error Message Display */}
                {currentState?.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-wide">
                        <ShieldCheck size={12} /> {currentState.error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={pending}
                    className="w-full bg-green-500 text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 mt-2"
                >
                    {pending ? <Loader2 className="animate-spin w-4 h-4" /> : (mode === 'login' ? <><LogIn size={14} /> Login to Dashboard</> : <><UserPlus size={14} /> Create Account</>)}
                </button>
            </form>

            <div className="text-center">
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                    Protected by reCAPTCHA & Sekerbaba Security
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
