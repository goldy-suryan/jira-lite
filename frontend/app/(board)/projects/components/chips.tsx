'use client';

import { removeFilter } from '@/app/state/features/filters.slice';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { selectFilterChips } from '@/app/state/selectors/filter-chip-builder.selector';
import { useEffect, useId, useState } from 'react';
import { FaPlus, FaX } from 'react-icons/fa6';

const Chips = () => {
  const [maxVisible, setMaxVisible] = useState(3);
  const chips = useAppSelector(selectFilterChips);
  const dispatch = useAppDispatch();
  const id = useId();

  useEffect(() => {
    const updateMaxVisble = () => {
      if (window.innerWidth < 640) {
        setMaxVisible(1);
      } else {
        setMaxVisible(3);
      }
    };
    updateMaxVisble();
    window.addEventListener('resize', updateMaxVisble);
    return () => window.removeEventListener('resize', updateMaxVisble);
  }, []);

  return (
    <div className="flex">
      {chips.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 fixed light:bg-[#ededed] dark:bg-black left-0 sm:left-[15%] mt-[2.8rem] right-0 px-6 sm:p-0 z-20">
          <span className="text-xs sm:text-sm font-semibold light:text-green-900 dark:text-green-400 hidden sm:inline">
            Applied Filters:
          </span>
          {chips.slice(0, maxVisible).map((item: any) => (
            <span
              key={`${id}_${item.label}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs border-1 uppercase"
            >
              {item.label}
              <button
                aria-label="remove"
                className=" ml-2 transition cursor-pointer focus:outline-none cursor-pointer"
                onClick={() =>
                  dispatch(removeFilter({ key: item.key, value: item.value }))
                }
              >
                <FaX />
              </button>
            </span>
          ))}
          {chips?.length > maxVisible && (
            <button className="inline-flex items-center px-1 rounded-full text-sm gap-1 cursor-pointer hover:text-cyan-500">
              <FaPlus size={12} /> {chips.length - maxVisible} more
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Chips;
