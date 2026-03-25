'use client';

import { Mark_AS_READ } from '@/app/graphql/mutations/notification.mutation';
import { GET_USER_NOTIFICATIONS } from '@/app/graphql/queries/notification.query';
import {
  COMMENT_NOTIFICATION,
  TASK_ASSIGNED,
} from '@/app/graphql/subscriptions/comment.subscriptions';
import { useAppSelector } from '@/app/state/hooks';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBell, FaCircle } from 'react-icons/fa6';
import { NotificationPanel } from './notificationPanel';

const Notification = () => {
  const notiRef = useRef<HTMLDivElement | null>(null);
  const userSelector = useAppSelector((state) => state.user.user);

  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: notificationData } = useQuery<any>(GET_USER_NOTIFICATIONS);
  const [markAsRead] = useMutation(Mark_AS_READ, {
    refetchQueries: [
      {
        query: GET_USER_NOTIFICATIONS,
      },
    ],
  });

  // ===== subscriptions
  const { data: notificationSubData } = useSubscription<any>(TASK_ASSIGNED, {
    variables: {
      userId: userSelector?.id,
    },
  });
  const { data: commentSubData } = useSubscription<any>(COMMENT_NOTIFICATION, {
    variables: {
      userId: userSelector?.id,
    },
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
      setNotifications(notificationData?.getAllUserNotification);
    }
  }, [notificationData]);

  useEffect(() => {
    if (notificationSubData) {
      setNotifications((prev) => [notificationSubData.taskAssigned, ...prev]);
    }
  }, [notificationSubData]);

  useEffect(() => {
    if (commentSubData) {
      setNotifications((prev) => [commentSubData.commentNotification, ...prev]);
    }
  }, [commentSubData]);

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
      <div className={`${openNotification && 'fixed inset-0 z-60'}`}>
        <div
          className={`
          fixed top-0 right-0 h-full
          w-[15vw] min-w-[25rem] max-w-[30rem]
          transform transition-transform duration-300 ease-in-out
          ${openNotification ? 'translate-x-0' : 'translate-x-full'}
          z-40
          flex flex-col
          shadow-xl
          overflow-auto
          dark:bg-black light:bg-white
          `}
          style={{ boxShadow: '-4px 0 6px -1px rgba(92, 92, 92, 0.5)' }}
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
      </div>
      <span className="relative">
        <FaBell
          onClick={() => setOpenNotification(true)}
          className="cursor-pointer h-5 w-5"
        />
        {notifications?.length > 0 &&
          notifications?.some((noti) => !noti.isRead) && (
            <FaCircle
              color={'green'}
              size={8}
              className="absolute top-0 right-0"
            />
          )}
      </span>
    </>
  );
};

export default Notification;
