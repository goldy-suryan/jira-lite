import UsersTask from './tasks';
import UserAssignedTasks from './userAssignedTasks';

export default function Dashboard() {
  return (
    <div className="mb-6">
      <div className="space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-2 text-cyan-600">
            Dashboard
          </h2>
          <div className="flex space-x-4">
            <button className="px-3 py-1 shadow-xl rounded text-sm cursor-pointer">
              Add gadget
            </button>
            <button className="px-3 py-1 shadow-xl rounded text-sm cursor-pointer">
              Edit layout
            </button>
            <button className="px-2 py-1 text-xl font-bold cursor-pointer">
              ...
            </button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Introduction */}
            <section className="light:shadow-xl dark:shadow-md dark:shadow-[#212124] rounded p-4 border-t-4 border-cyan-500">
              <div className=" mb-3 pb-1 font-semibold">Focus Today</div>
              <ul className="font-normal text-sm">
                <li>Fix login bug (Due today)</li>
                <li>Fix login bug (Due today)</li>
                <li>Fix login bug (Due today)</li>
              </ul>
            </section>

            {/* Quick links */}
            <UsersTask />

            {/* Pie Chart panel (static placeholder) */}
            <section className="light:shadow-xl dark:shadow-md dark:shadow-[#212124] rounded p-4 border-t-4 border-cyan-500">
              <div className=" mb-3 pb-1 font-semibold">
                Pie Chart: Phone App
              </div>
              <div className="flex flex-col items-center">
                {/* Static panel instead of pie chart */}
                <div className="w-40 h-40 shadow-xl rounded-full flex items-center justify-center text-sm text-center">
                  Pie Chart Placeholder
                </div>
                <div className="mt-4 text-sm w-full max-w-xs">
                  <p>
                    <strong>Assignees</strong>
                  </p>
                  <p>Total Issues: 9</p>
                  <ul className="mt-2 space-y-1">
                    <li>Thom - 5</li>
                    <li>Charlotte - 2</li>
                    <li>Charlotte - 1</li>
                    <li>Unassigned - 1</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Right column (spans 2 columns on md+) */}
          <div className="md:col-span-2 space-y-6">
            {/* Favorite Filters */}
            <section className="light:shadow-xl dark:shadow-md dark:shadow-[#212124] rounded p-4 border-t-4 border-cyan-500 ">
              <div className=" mb-3 pb-1 font-semibold">Favorite Filters</div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between cursor-pointer">
                  <span>Filter for PA board</span>
                  <span className="font-semibold">9</span>
                </li>
                <li className="flex justify-between cursor-pointer">
                  <span>Filter for PRAC board Short Estimate</span>
                  <span className="font-semibold">5</span>
                </li>
                <li className="cursor-pointer underline">Manage Filters</li>
              </ul>
            </section>

            {/* Assigned to Me */}
            <UserAssignedTasks />

            {/* Activity Stream */}
            <section className="light:shadow-xl dark:shadow-md dark:shadow-[#212124] rounded p-4 border-t-4 border-cyan-500 ">
              <div className=" mb-3 pb-1 font-semibold">Activity Stream</div>
              <div className="space-y-4 text-sm max-h-64 overflow-y-auto">
                <div>
                  <div className="font-semibold">Charlotte</div>
                  <p>
                    started progress on DES-6. As a user, I need app to open on
                    first disk so I can start it with one hand.
                  </p>
                  <div className="text-xs text-gray-500">
                    1 hour ago · Current
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Charlotte</div>
                  <p>
                    updated the Rank of DES-6. As a user, I need app to open on
                    first disk so I can start it with one hand.
                  </p>
                  <div className="text-xs text-gray-500">
                    1 hour ago · Current
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Charlotte</div>
                  <p>
                    updated the Sprint of DES-6. As a user, I need strong
                    contrast so I can see text clearly.
                  </p>
                  <div className="text-xs text-gray-500">
                    1 hour ago · Current
                  </div>
                </div>
                <button className="w-full shadow-xl rounded py-1 text-sm cursor-pointer">
                  Show more...
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
