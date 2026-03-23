import { FaBell, FaCircle, FaX } from 'react-icons/fa6';

export const NotificationPanel = ({ isOpen, setIsOpen }) => {
  return (
    <aside className="h-full">
      <div className="flex items-center justify-between mt-1 px-6 py-8 border-b dark:border-gray-500 light:border-gray-400">
        <div className="flex items-center gap-2">
          <FaBell className="text-blue-500" />
          <h2 className="font-semibold text-lg">Notifications</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close notifications"
          className=" text-xl font-bold"
        >
          <FaX className="cursor-pointer" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center border-b-2 dark:border-gray-700 light:border-gray-400 px-4 py-2 light:hover:border-l-4 light:hover:border-green-800 dark:hover:border-l-4 dark:hover:border-green-800 cursor-pointer">
          <div className="mr-4">
            <FaCircle
              color="green"
              className="shadow-2xl shadow-green-500"
              size={8}
            />
          </div>
          <div>
            <p className="text-sm">Project The Monolith updated</p>
            <span className="text-xs text-gray-400">1w ago</span>
          </div>
        </div>
        <div className="flex items-center border-b-2 dark:border-gray-700 light:border-gray-400 px-4 py-2 light:hover:border-l-4 light:hover:border-green-800 dark:hover:border-l-4 dark:hover:border-green-800 cursor-pointer">
          <div className="mr-4">
            <FaCircle
              color="green"
              className="shadow-2xl shadow-green-500"
              size={8}
            />
          </div>
          <div>
            <p className="text-sm">Project The Monolith updated</p>
            <span className="text-xs text-gray-400">1w ago</span>
          </div>
        </div>
        <div className="flex items-center border-b-2 dark:border-gray-700 light:border-gray-400 px-4 py-2 light:hover:border-l-4 light:hover:border-green-800 dark:hover:border-l-4 dark:hover:border-green-800 cursor-pointer">
          <div className="mr-4">
            <FaCircle
              color="green"
              className="shadow-2xl shadow-green-500"
              size={8}
            />
          </div>
          <div>
            <p className="text-sm">Project The Monolith updated</p>
            <span className="text-xs text-gray-400">1w ago</span>
          </div>
        </div>
        <div className="flex items-center border-b-2 dark:border-gray-700 light:border-gray-400 px-4 py-2 light:hover:border-l-4 light:hover:border-green-800 dark:hover:border-l-4 dark:hover:border-green-800 cursor-pointer">
          <div className="mr-4">
            {/* <FaCircle color="green" className="shadow-2xl shadow-green-500" size={8}/> */}
          </div>
          <div>
            <p className="text-sm">Project The Monolith updated</p>
            <span className="text-xs text-gray-400">1w ago</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 text-center fixed bottom-0 w-full">
        <button className="text-blue-500 hover:underline">
          MARK ALL AS READ
        </button>
      </div>
    </aside>
  );
};
