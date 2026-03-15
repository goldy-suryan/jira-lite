'use client';

import { useEffect, useState } from 'react';

export const TaskActivity = ({ activities }) => {
  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    setActivityList(activities);
  }, [activities]);

  return (
    <ul className="list-disc list-inside space-y-2 text-sm">
      {!activityList?.length && (
        <div className="flex items-center justify-center">
          <p className="text-center">No activities yet</p>
        </div>
      )}
      {activityList?.length > 0 &&
        activityList?.map((act: any) => (
          <li key={act.id}>
            <span className="text-white">{act.action}</span>
          </li>
        ))}
    </ul>
  );
};
