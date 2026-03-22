'use client';

import { useEffect, useRef, useState } from 'react';

export const TaskActivity = ({ activities, tabIndex }) => {
  const [activityList, setActivityList] = useState([]);
  const activityRef = useRef<any>(null);

  useEffect(() => {
    setActivityList(activities);
    if (activityRef?.current) {
      activityRef.current.scrollTo({
        top: activityRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [activities, tabIndex, activityRef?.current]);

  return (
    <ul
      className="list-disc list-inside space-y-2 text-sm overflow-y-auto max-h-[13rem] sm:max-h-[13rem] xl:max-h-[23rem]"
      ref={activityRef}
    >
      {!activityList?.length && (
        <div className="flex items-center justify-center">
          <p className="text-center">No activities yet</p>
        </div>
      )}
      {activityList?.length > 0 &&
        activityList?.map((act: any) => (
          <li key={act.id}>
            <span className="">{act.action}</span>
          </li>
        ))}
    </ul>
  );
};
