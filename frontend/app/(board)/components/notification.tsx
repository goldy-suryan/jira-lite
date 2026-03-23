'use client';

import { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa6';
import { NotificationPanel } from './notificationPanel';

const Notification = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const notiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setOpenNotification(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notiRef.current]);

  const hideNotiPanel = () => {
    setOpenNotification(false);
  };

  return (
    <>
      <FaBell
        onClick={() => setOpenNotification(true)}
        className="cursor-pointer h-5 w-5"
      />
      <div
        className={`
          fixed top-0 right-0 h-full
          w-[15vw] min-w-[25rem] max-w-[30rem]
          transform transition-transform duration-300 ease-in-out
          ${openNotification ? 'translate-x-0' : 'translate-x-full'}
          z-40
          flex flex-col
          shadow-xl
          dark:bg-black light:bg-white
          `}
        style={{ boxShadow: '-5px 0 20px -3px rgba(0, 0, 0, 0.5)' }}
      >
        {openNotification && (
          <div ref={notiRef}>
            <NotificationPanel
              isOpen={openNotification}
              setIsOpen={hideNotiPanel}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;
