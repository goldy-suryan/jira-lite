export default function Dashboard() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-cyan-600 text-md">Dashboard</h2>
      <div className="mx-auto p-6 font-sans">
        {/* Greeting and notification */}
        {/* <div className="flex justify-between items-center mb-6 font-semibold text-lg">
          <div>👋 Good Morning, Goldy</div>
          <div className="cursor-pointer select-none">🔔</div>
        </div> */}

        {/* Task summary */}
        <div className="flex gap-6 mb-8">
          <div>[24 Tasks]</div>
          <div>[8 In Progress]</div>
          <div>[12 Done]</div>
          <div>[4 Overdue]</div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-8 border-t border-gray-300 py-8">
          {/* My Tasks */}
          <section>
            <h2 className="font-semibold mb-3">My Tasks</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Fix login bug</li>
              <li>Update UI</li>
            </ul>
          </section>

          {/* Due Today */}
          <section>
            <h2 className="font-semibold mb-3">Due Today</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>API issue</li>
              <li>DB migration</li>
            </ul>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="font-semibold mb-3">Recent Activity</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Task moved</li>
              <li>Comment added</li>
            </ul>
          </section>

          {/* Project Summary */}
          <section>
            <h2 className="font-semibold mb-3">Project Summary</h2>
            <div className="space-y-1">
              <div>Frontend (70%)</div>
              <div>Backend (50%)</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
