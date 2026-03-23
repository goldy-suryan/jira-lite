'use client';

import { Mark_AS_READ } from '@/app/graphql/mutations/notification.mutation';
import { GET_USER_NOTIFICATIONS } from '@/app/graphql/queries/notification.query';
import { TASK_ASSIGNED } from '@/app/graphql/subscriptions/comment.subscriptions';
import { useAppSelector } from '@/app/state/hooks';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBell } from 'react-icons/fa6';
import { NotificationPanel } from './notificationPanel';

const Notification = () => {
  const notiRef = useRef<HTMLDivElement | null>(null);
  const userSelector = useAppSelector((state) => state.user.user);

  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: notificationSubData } = useSubscription<{ taskAssigned: any }>(
    TASK_ASSIGNED,
    {
      variables: {
        userId: userSelector?.id,
      },
    },
  );
  const { data: notificationData } = useQuery<any>(GET_USER_NOTIFICATIONS);
  const [markAsRead] = useMutation(Mark_AS_READ, {
    refetchQueries: [
      {
        query: GET_USER_NOTIFICATIONS,
      },
    ],
  });

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setOpenNotification(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notiRef.current]);

  useEffect(() => {
    if (notificationData) {
      setNotifications((prev) => notificationData?.getAllUserNotification);
    }
    if (notificationSubData) {
      setNotifications((prev) => [notificationSubData.taskAssigned, ...prev]);
    }
  }, [notificationData, setNotifications, notificationSubData]);

  const hideNotiPanel = () => {
    setOpenNotification(false);
  };

  const markRead = async (notiId) => {
    try {
      await markAsRead({
        variables: {
          notiId,
        },
      });
    } catch (e: any) {
      toast.error(e.message);
    }
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
              setIsOpen={hideNotiPanel}
              notifications={notifications}
              markRead={markRead}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;
