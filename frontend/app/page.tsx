import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col px-10">
      <nav className="flex justify-between items-center py-6 shadow mb-16">
        <h1 className="text-xl font-bold text-blue-500">JiraLite</h1>

        <div className="space-x-6">
          <Link
            href="/login"
            className="text-white/80 hover:text-white transition font-medium"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Manage Projects <span className="text-blue-500">Effortlessly</span>
        </h2>
        <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto">
          JiraLite helps teams track tasks, collaborate, and ship faster with an
          intuitive Kanban board.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/30 px-6 py-3 text-white/90 font-semibold hover:bg-white/10 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <FeatureCard
          title="Kanban Boards"
          description="Visualize project progress using powerful boards."
        />
        <FeatureCard
          title="Team Collaboration"
          description="Assign tasks, comment, and work together easily."
        />
        <FeatureCard
          title="Project Insights"
          description="Track progress and deliver projects faster."
        />
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: Record<string, string>) {
  return (
    <div className="rounded-2xl bg-white/5 p-6 shadow-lg border border-white/10">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
}
