'use client';

import { LockIcon, MailIcon, UserIcon } from '@/app/(auth)/components/icons';
import { instance } from '@/app/utils/interceptors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setformValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const strength = useMemo(() => {
    const v = formValues.password;
    if (!v)
      return { label: '—', tone: 'text-white/70 border-white/15 bg-white/5' };

    let score = 0;
    if (v.length >= 8) score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const s = Math.min(score, 5);

    if (s <= 1)
      return {
        label: 'Weak',
        tone: 'text-rose-200 border-rose-400/30 bg-rose-500/10',
      };
    if (s === 2)
      return {
        label: 'Fair',
        tone: 'text-amber-200 border-amber-400/30 bg-amber-500/10',
      };
    if (s === 3)
      return {
        label: 'Good',
        tone: 'text-cyan-200 border-cyan-400/30 bg-cyan-500/10',
      };
    return {
      label: 'Strong',
      tone: 'text-emerald-200 border-emerald-400/30 bg-emerald-500/10',
    };
  }, [formValues.password]);

  const registerUser = async () => {
    try {
      if (!formValues.email || !formValues.password) {
        return setError('Missing required fields');
      }
      await instance.post('/auth/register', formValues);
      router.replace('/dashboard');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 grid place-items-center bg-zinc-950 text-white overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -top-24 -right-40 h-[560px] w-[560px] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -bottom-56 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
      </div>

      <section className="relative w-full max-w-md">
        <header className="relative">
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Create your account
          </h1>
        </header>

        <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="p-6 sm:p-7">
            <form noValidate className="grid gap-6">
              {/* Name */}
              <div className="grid gap-2.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-white/80"
                >
                  Full name
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/70">
                    <UserIcon className="h-5 w-5" />
                  </div>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={formValues.name}
                    onChange={(e) =>
                      setformValues({ ...formValues, name: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-400/15"
                    required
                  />
                </div>

                <p className="text-xs text-white/55">
                  Use your real name for receipts and account recovery.
                </p>
              </div>

              {/* Email */}
              <div className="grid gap-2.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/80"
                >
                  Email
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/70">
                    <MailIcon className="h-5 w-5" />
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john.doe@example.com"
                    value={formValues.email}
                    onChange={(e) =>
                      setformValues({ ...formValues, email: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-400/15"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-2.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/80"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/70">
                    <LockIcon className="h-5 w-5" />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={formValues.password}
                    onChange={(e) =>
                      setformValues({ ...formValues, password: e.target.value })
                    }
                    minLength={8}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-16 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-violet-300/40 focus:ring-4 focus:ring-violet-400/15"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute inset-y-0 right-0 px-3 text-xs font-semibold tracking-wide text-white/70 hover:text-white transition"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-white/55">
                    At least 8 characters.
                  </p>
                  <span
                    className={[
                      'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                      strength.tone,
                    ].join(' ')}
                  >
                    Strength: {strength.label}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={registerUser}
                className="h-11 w-full rounded-xl border text-sm font-semibold tracking-tight transition shadow-[0_10px_30px_rgba(0,0,0,0.35)] active:scale-[0.99] border-violet-300/30 bg-gradient-to-b from-violet-400/25 to-violet-400/10 hover:from-violet-400/30 hover:to-violet-400/12"
              >
                Sign in
              </button>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <p className="text-sm text-white/65">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-white/90 underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
