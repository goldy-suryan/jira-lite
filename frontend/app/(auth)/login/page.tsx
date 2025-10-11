'use client';
import { LockIcon, MailIcon } from '@/app/components/icons';
import { instance } from '@/app/utils/interceptors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Login() {
  const [formVal, setFormVal] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const login = async () => {
    try {
      if (!formVal.email || !formVal.password) {
        setError('Email and Password are required');
      }
      const { data } = await instance.post<any>('/auth/login', formVal);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.id,
          name: data.name,
          role: data.role,
          email: data.email,
        }),
      );
      router.replace('/dashboard');
    } catch (e: any) {
      console.log(e.error, 'error here while loging');
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
            Sign in to your account
          </h1>
        </header>

        <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="p-6 sm:p-7">
            <form noValidate className="grid gap-6">
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
                    placeholder="ada@company.com"
                    value={formVal.email}
                    onChange={(e) =>
                      setFormVal({ ...formVal, email: e.target.value })
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
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formVal.password}
                    onChange={(e) =>
                      setFormVal({ ...formVal, password: e.target.value })
                    }
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
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={login}
                className="h-11 w-full rounded-xl border text-sm font-semibold tracking-tight transition shadow-[0_10px_30px_rgba(0,0,0,0.35)] active:scale-[0.99] border-violet-300/30 bg-gradient-to-b from-violet-400/25 to-violet-400/10 hover:from-violet-400/30 hover:to-violet-400/12"
              >
                Sign in
              </button>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <p className="text-sm text-white/65">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-white/90 underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
