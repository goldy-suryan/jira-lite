'use client';

import { instance } from '@/app/utils/interceptors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FaLock, FaRegEnvelope, FaRegUser } from 'react-icons/fa6';

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
      return { label: '—', tone: 'dark:border-white/15 dark:bg-white/5' };

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
        tone: 'light:text-red-100 light:border-red-400 light:bg-red-500 dark:text-rose-200 dark:border-rose-400/30 dark:bg-rose-500/10',
      };
    if (s === 2)
      return {
        label: 'Fair',
        tone: 'light:text-amber-100 light:border-amber-400 light:bg-amber-500 dark:text-amber-200 dark:border-amber-400/30 dark:bg-amber-500/10',
      };
    if (s === 3)
      return {
        label: 'Good',
        tone: 'light:text-cyan-100 light:border-cyan-400 light:bg-cyan-500 dark:text-cyan-200 dark:border-cyan-400/30 dark:bg-cyan-500/10',
      };
    return {
      label: 'Strong',
      tone: 'light:text-emerald-100 light:border-emerald-400 light:bg-emerald-500 dark:text-emerald-200 dark:border-emerald-400/30 dark:bg-emerald-500/10',
    };
  }, [formValues.password]);

  const registerUser = async () => {
    if (!formValues.email || !formValues.password) {
      return setError('Missing required fields');
    }
    await instance.post('/auth/register', formValues);
    router.replace('/dashboard');
  };

  return (
    <main className="min-h-screen px-6 py-12 grid place-items-center dark:bg-zinc-950 overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -top-24 -right-40 h-[560px] w-[560px] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -bottom-56 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
      </div>

      <section className="relative w-full max-w-md">
        <header className="relative">
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-cyan-500">
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
                  className="text-sm font-medium"
                >
                  Full name
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <FaRegUser className="h-4 w-4" />
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
                    className="h-11 w-full rounded-xl border border-white/10 dark:bg-white/5 pl-11 pr-4 text-sm outline-none transition"
                    required
                  />
                </div>

                <p className="text-xs">
                  Use your real name for receipts and account recovery.
                </p>
              </div>

              {/* Email */}
              <div className="grid gap-2.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <FaRegEnvelope className="h-4 w-4" />
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
                    className="h-11 w-full rounded-xl dark:bg-white/5 pl-11 pr-4 text-sm outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-2.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <FaLock className="h-4 w-4" />
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
                    className="h-11 w-full rounded-xl dark:bg-white/5 pl-11 pr-16 text-sm outline-none transition"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute inset-y-0 right-0 px-3 text-xs font-semibold tracking-wide transition"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs">
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
                className="h-11 w-full rounded-xl border text-sm font-semibold tracking-tight transition shadow-[0_10px_30px_rgba(0,0,0,0.35)] active:scale-[0.99] border-violet-300/30 light:bg-cyan-600 light:text-white dark:bg-gradient-to-b from-violet-400/25 to-violet-400/10 hover:from-violet-400/30 hover:to-violet-400/12 cursor-pointer"
              >
                Register
              </button>

              <div className="h-px w-full bg-gradient-to-r from-transparent dark:via-white/15 light:via-gray-500 to-transparent" />

              <p className="text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="hover:underline hover:underline-offset-4 hover:decoration-cyan-500 transition"
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
