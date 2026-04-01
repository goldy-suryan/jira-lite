import { formatDate } from '@/app/utils/helperFunc';
import { FaBell, FaCircle, FaX } from 'react-icons/fa6';

export const NotificationPanel = ({ setIsOpen, notifications, markRead }) => {
  return (
    <aside className="fixed top-0 bottom-0 right-0 w-screen sm:w-[28vw] flex flex-col h-full shadow-xl dark:bg-black light:bg-white z-40">
      <header className="p-6 border-b border-gray-700 flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
          <FaBell className="text-cyan-500" size={18}/> Notifications
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close panel"
        >
          <FaX className="cursor-pointer" />
        </button>
      </header>

      <div className="flex-1">
        {notifications?.length > 0 ? (
          notifications.map((noti) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                markRead(noti.id);
              }}
              key={noti.id}
              className="flex items-center border-b-2 dark:border-gray-700 light:border-gray-400 px-4 py-2 light:hover:bg-cyan-200 dark:hover:bg-cyan-300 dark:hover:text-gray-900 cursor-pointer"
            >
              {!noti.isRead && (
                <div className="mr-4">
                  <FaCircle
                    color="green"
                    className="shadow-2xl shadow-green-500"
                    size={8}
                  />
                </div>
              )}

              <div key={noti.id} className={`${noti.isRead && 'ml-7'}`}>
                <p className="text-md">{noti.title}</p>
                <p className="text-sm">{noti.message}</p>
                <span className="text-xs text-gray-400">
                  {formatDate(noti.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="flex justify-center mt-8 text-md">No notification</p>
        )}
      </div>

      {notifications?.length > 0 && (
        <div className="p-4 border-t border-gray-700 dark:bg-black light:bg-gray-100 text-center flex-shrink-0">
          <button className="text-cyan-500 hover:font-semibold cursor-pointer tracking-wide">
            MARK ALL AS READ
          </button>
        </div>
      )}
    </aside>
  );
};
