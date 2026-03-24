import { formatDate } from '@/app/utils/helperFunc';
import { FaBell, FaCircle, FaX } from 'react-icons/fa6';

export const NotificationPanel = ({ setIsOpen, notifications, markRead }) => {
  return (
    <aside className="fixed top-0 bottom-0 right-0 w-[15vw] min-w-[25rem] max-w-[30rem] flex flex-col h-full shadow-xl dark:bg-black light:bg-white z-40">
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
        {notifications?.length > 0 ? (
          notifications.map((noti) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                markRead(noti.id);
              }}
              key={noti.id}
              className="flex items-center border-b-2 dark:border-gray-700 light:border-gray-400 px-4 py-2 light:hover:border-green-800 dark:hover:border-green-800 cursor-pointer"
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
          <button className="text-blue-500 hover:underline">
            MARK ALL AS READ
          </button>
        </div>
      )}
    </aside>
  );
};
