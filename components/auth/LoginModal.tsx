'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, ArrowRight, Loader2, RotateCcw,
  CheckCircle2, ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import toast from 'react-hot-toast';

type Step = 'entry' | 'otp' | 'done';

export default function LoginModal() {
  const { modalOpen, closeModal, setUser, modalCallback } = useAuthStore();

  const [step, setStep] = useState<Step>('entry');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const emailRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── reset on open ── */
  useEffect(() => {
    if (!modalOpen) return;
    setStep('entry');
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setLoading(false);
    setTimeout(() => emailRef.current?.focus(), 80);
  }, [modalOpen]);

  /* ── cooldown ticker ── */
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  /* ── ESC to close ── */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [closeModal]);

  /* ── send OTP ── */
  async function sendOTP(emailTarget = email) {
    const e = emailTarget.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/user/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setStep('otp');
      setCooldown(60);
      toast.success('Check your inbox for the code', { icon: '📧' });
      setTimeout(() => otpRefs.current[0]?.focus(), 80);
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  /* ── verify OTP ── */
  async function verifyOTP(codeArg?: string) {
    const code = codeArg ?? otp.join('');
    if (code.length !== 6) { setError('Enter all 6 digits'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/user/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setUser(d.user);
      setStep('done');
      setTimeout(() => {
        closeModal();
        modalCallback?.();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Invalid code');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 30);
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP input helpers ── */
  function onDigitChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError('');
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (val && i === 5 && next.every(Boolean)) verifyOTP(next.join(''));
  }

  function onDigitKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus();
  }

  function onDigitPaste(e: React.ClipboardEvent) {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(''));
      otpRefs.current[5]?.focus();
      verifyOTP(digits);
    }
  }

  return (
    <AnimatePresence>
      {modalOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeModal}
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
          />

          {/* ── Modal ── */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.88, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-[360px] rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg,#131c2b 0%,#0d1117 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Red accent top line */}
              <div style={{ height: 2, background: 'linear-gradient(90deg,transparent 0%,#e63030 40%,#e63030 60%,transparent 100%)' }} />

              {/* ── Header ── */}
              <div className="flex items-start justify-between px-6 pt-5 pb-0">
                <div className="flex-1 min-w-0">
                  {step === 'otp' && (
                    <button
                      onClick={() => { setStep('entry'); setOtp(['','','','','','']); setError(''); }}
                      className="flex items-center gap-1 text-[11px] mb-3 transition-colors"
                      style={{ color: 'rgba(255,255,255,0.28)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
                    >
                      <ChevronLeft size={11} /> Back
                    </button>
                  )}
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                    {step === 'done' ? '🎉 You\'re signed in!' : 'Sign in to Cold Dog'}
                  </h2>
                  <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.65)', marginTop: 4, lineHeight: 1.5 }}>
                    {step === 'entry' && 'Browse freely. Sign in only when you need to.'}
                    {step === 'otp' && <>Code sent to <span style={{ color: 'rgba(255,255,255,0.7)' }}>{email}</span></>}
                    {step === 'done' && 'Welcome back! Redirecting…'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-3 mt-0.5 transition-all"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* ── Body ── */}
              <div style={{ padding: '20px 24px 24px' }}>
                <AnimatePresence mode="wait">

                  {/* Entry step */}
                  {step === 'entry' && (
                    <motion.div key="entry"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.16 }}>

                      {/* Google button */}
                      <button
                        onClick={() => { window.location.href = '/api/auth/user/google'; }}
                        className="w-full flex items-center justify-center gap-2.5 rounded-xl transition-all active:scale-[0.98]"
                        style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.78)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 14 }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </button>

                      {/* Divider */}
                      <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                      </div>

                      {/* Email input */}
                      <div style={{ position: 'relative', marginBottom: error ? 6 : 12 }}>
                        <Mail size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} />
                        <input
                          ref={emailRef}
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setError(''); }}
                          onKeyDown={e => e.key === 'Enter' && sendOTP()}
                          placeholder="your@email.com"
                          autoComplete="email"
                          style={{
                            width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                            borderRadius: 12, fontSize: 13, color: 'white', outline: 'none',
                            background: 'rgba(255,255,255,0.06)',
                            border: `1.5px solid ${error ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.1)'}`,
                            transition: 'border-color 0.2s',
                          }}
                          onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.28)'; }}
                          onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        />
                      </div>

                      {error && <p style={{ color: '#f87171', fontSize: 11, marginBottom: 10, paddingLeft: 2 }}>{error}</p>}

                      {/* Continue button */}
                      <motion.button
                        onClick={() => sendOTP()}
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2"
                        style={{
                          padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: 'white',
                          background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#e63030,#b91c1c)',
                          boxShadow: loading ? 'none' : '0 4px 18px rgba(230,48,48,0.3)',
                          opacity: loading ? 0.6 : 1, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {loading
                          ? <Loader2 size={15} className="animate-spin" />
                          : <><span>Continue</span><ArrowRight size={14} /></>
                        }
                      </motion.button>

                      <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.18)', marginTop: 14, lineHeight: 1.5 }}>
                        By continuing, you agree to our Terms & Privacy Policy
                      </p>
                    </motion.div>
                  )}

                  {/* OTP step */}
                  {step === 'otp' && (
                    <motion.div key="otp"
                      initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.16 }}>

                      {/* 6-digit input */}
                      <div className="flex justify-center gap-2" style={{ marginBottom: error ? 8 : 16 }} onPaste={onDigitPaste}>
                        {otp.map((d, i) => (
                          <input
                            key={i}
                            ref={el => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onChange={e => onDigitChange(i, e.target.value)}
                            onKeyDown={e => onDigitKey(i, e)}
                            style={{
                              width: 44, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 700,
                              borderRadius: 12, outline: 'none', color: 'white', fontFamily: 'monospace',
                              background: d ? 'rgba(230,48,48,0.1)' : 'rgba(255,255,255,0.05)',
                              border: `2px solid ${d ? 'rgba(230,48,48,0.55)' : 'rgba(255,255,255,0.1)'}`,
                              boxShadow: d ? '0 0 14px rgba(230,48,48,0.18)' : 'none',
                              transition: 'all 0.15s',
                            }}
                          />
                        ))}
                      </div>

                      {error && <p style={{ color: '#f87171', fontSize: 11, textAlign: 'center', marginBottom: 10 }}>{error}</p>}

                      {/* Verify button */}
                      <motion.button
                        onClick={() => verifyOTP()}
                        disabled={loading || otp.join('').length !== 6}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2"
                        style={{
                          padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: 'white',
                          background: (loading || otp.join('').length !== 6) ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#e63030,#b91c1c)',
                          boxShadow: (loading || otp.join('').length !== 6) ? 'none' : '0 4px 18px rgba(230,48,48,0.3)',
                          opacity: (loading || otp.join('').length !== 6) ? 0.5 : 1,
                          border: 'none', cursor: (loading || otp.join('').length !== 6) ? 'not-allowed' : 'pointer',
                          marginBottom: 14, transition: 'all 0.2s',
                        }}
                      >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : 'Verify & Sign In'}
                      </motion.button>

                      {/* Resend */}
                      <div style={{ textAlign: 'center' }}>
                        {cooldown > 0
                          ? <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>Resend in {cooldown}s</span>
                          : <button
                              onClick={() => sendOTP()}
                              className="flex items-center gap-1.5 mx-auto transition-colors"
                              style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', background: 'none', border: 'none', cursor: 'pointer' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
                            >
                              <RotateCcw size={10} /> Resend code
                            </button>
                        }
                      </div>
                    </motion.div>
                  )}

                  {/* Done step */}
                  {step === 'done' && (
                    <motion.div key="done"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.06 }}
                        style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.35)' }}
                      >
                        <CheckCircle2 size={26} style={{ color: '#4ade80' }} />
                      </motion.div>
                      <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.6)' }}>
                        Signed in as <span style={{ color: 'rgba(255,255,255,0.8)' }}>{email}</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
