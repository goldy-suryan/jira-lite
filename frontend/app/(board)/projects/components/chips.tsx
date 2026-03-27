'use client';

import { removeFilter } from '@/app/state/features/filters.slice';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { selectFilterChips } from '@/app/state/selectors/filter-chip-builder.selector';
import { useId } from 'react';
import { FaPlus, FaX } from 'react-icons/fa6';

const Chips = () => {
  const chips = useAppSelector(selectFilterChips);
  const dispatch = useAppDispatch();
  const id = useId();

  return (
    <div className="flex">
      {chips.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 fixed left-0 sm:left-[15%] -mt-[2.4rem] right-0 px-6 z-20">
          <span className="text-sm text-green-400">Applied Filters:</span>
          {chips.slice(0, 3).map((item: any) => (
            <span
              key={`${id}_${item.label}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs border-1 border-gray-400 text-gray-300 uppercase"
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
          {chips?.length > 3 && <button className="inline-flex items-center px-1 rounded-full text-md text-gray-100 text-gray-300 gap-1 cursor-pointer hover:text-cyan-500">
              <FaPlus size={12} /> {chips.length - 3}
          </button>}
        </div>
      )}
    </div>
  );
};

export default Chips;
