'use client';

import { FILTER_TASKS } from '@/app/graphql/mutations/board.mutation';
import {
  clearAll,
  setFilters,
  toggleFilters,
} from '@/app/state/features/filters.slice';
import { addFilteredTasks } from '@/app/state/features/project.slice';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { columnsData } from '@/app/utils/constants';
import { useMutation } from '@apollo/client/react';
import moment from 'moment';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  BsChevronDoubleDown,
  BsChevronDoubleUp,
  BsChevronExpand,
} from 'react-icons/bs';
import { FaX } from 'react-icons/fa6';

const FilterOverlay = ({ isOpen, closePanel }) => {
  const dispatcher = useAppDispatch();
  const currentProjectSel = useAppSelector(
    (state) => state.project.currentProject,
  );
  const filters = useAppSelector((state) => state.filters.appliedFilters);

  const [filterTasks, { data: filteredData, loading }] =
    useMutation<any>(FILTER_TASKS);

  useEffect(() => {
    if (!loading) {
      dispatcher(addFilteredTasks(filteredData?.filterTasks));
    }
  }, [filteredData, dispatcher]);

  const applyFilters = async () => {
    try {
      await filterTasks({
        variables: {
          input: filters,
        },
      });
      toast.success('Done filtering');
      // closePanel();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className={`${isOpen && 'fixed inset-0 z-50'}`}>
      <div
        className={`
          fixed top-0 right-0 h-full
          w-screen sm:w-[28vw]
          transform transition-transform duration-300 ease-in-out
          z-50
          flex flex-col
          shadow-xl
          dark:bg-black light:bg-[#ededed]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ boxShadow: '-4px 0 6px -1px rgba(92, 92, 92, 0.5)' }}
      >
        <header className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Refine Workspace
          </h2>
          <button onClick={closePanel} aria-label="Close panel">
            <FaX className="cursor-pointer" />
          </button>
        </header>

        {/* Panel content here */}
        <div className="flex-1 p-6 flex flex-col gap-8 text-sm text-gray-300">
          <div>
            <label
              htmlFor="search-keywords"
              className="block uppercase text-xs font-semibold mb-2 dark:text-cyan-400 light:text-gray-900"
            >
              SEARCH KEYWORDS
            </label>
            <input
              id="search-keywords"
              type="text"
              placeholder="Title or desc..."
              className="w-full rounded-md dark:bg-white/5 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onChange={(e) =>
                dispatcher(
                  setFilters({ key: 'searchTerm', value: e.target.value }),
                )
              }
            />
          </div>

          <div>
            <p className="uppercase text-xs font-semibold mb-2 dark:text-cyan-400 light:text-gray-900">
              PIPELINE STAGE
            </p>
            <div className="grid grid-cols-2 gap-4">
              {columnsData.map((stage) => (
                <button
                  key={stage.id}
                  onClick={(e) =>
                    dispatcher(
                      toggleFilters({ key: 'status', value: stage.general }),
                    )
                  }
                  className={`flex-1 py-2 rounded-md text-center uppercase cursor-pointer uppercase ${
                    filters.status.includes(stage.general)
                      ? 'bg-cyan-600 text-white font-semibold'
                      : 'dark:bg-[#1e1e1e] dark:text-gray-400 hover:bg-[#2a2a2a] light:bg-gray-300 light:text-gray-900'
                  }`}
                >
                  {stage.general}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Index */}
          <div>
            <p className="uppercase text-xs font-semibold mb-2 dark:text-cyan-400 light:text-gray-900">
              PRIORITY INDEX
            </p>
            <ul className="space-y-2">
              <li
                className={`flex items-center gap-3 cursor-pointer ${filters.priority.includes('high') ? 'text-cyan-500' : 'light:text-gray-700'}`}
                onClick={(e) =>
                  dispatcher(toggleFilters({ key: 'priority', value: 'high' }))
                }
              >
                <BsChevronDoubleUp color="red" />
                <span>High</span>
                <span className="ml-auto text-xs">14</span>
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer ${filters.priority.includes('medium') ? 'text-cyan-500' : 'light:text-gray-700'}`}
                onClick={(e) =>
                  dispatcher(
                    toggleFilters({ key: 'priority', value: 'medium' }),
                  )
                }
              >
                <BsChevronExpand color="orange" />
                <span>Medium</span>
                <span className="ml-auto text-xs">12</span>
              </li>
              <li
                className={`flex items-center gap-3 cursor-pointer ${filters.priority.includes('low') ? 'text-cyan-500' : 'light:text-gray-700'}`}
                onClick={(e) =>
                  dispatcher(toggleFilters({ key: 'priority', value: 'low' }))
                }
              >
                <BsChevronDoubleDown color="green" />
                <span>Low</span>
                <span className="ml-auto text-xs">08</span>
              </li>
            </ul>
          </div>

          {/* Operatives */}
          <div>
            <p className="uppercase text-xs font-semibold mb-2 dark:text-cyan-400 light:text-gray-900">
              OPERATIVES
            </p>
            <div className="flex items-center gap-3">
              {(currentProjectSel as any)?.users?.length > 0 &&
                (currentProjectSel as any)?.users.map((user) => {
                  return (
                    <span
                      key={user?.id}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer ${filters.member.includes(user.id) ? 'bg-cyan-500 border-cyan-800 text-black font-semibold' : 'border-gray-500'}`}
                      onClick={(e) =>
                        dispatcher(
                          toggleFilters({ key: 'member', value: user.id }),
                        )
                      }
                    >
                      {user?.name?.[0]}
                    </span>
                  );
                })}
              {/* <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Operative 1"
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${filters.member.includes('mem123') ? 'border-cyan-400' : 'border-gray-700'}`}
                onClick={(e) => dispatch({ type: 'MEMBER', payload: 'mem123' })}
              /> */}
              {/* <button
                className="w-8 h-8 rounded-full border-2 border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-cyan-400 transition"
                aria-label="Add Operative"
              >
                +
              </button> */}
            </div>
          </div>

          {/* Temporal Constraints */}
          <div>
            <p className="uppercase text-xs font-semibold mb-2 dark:text-cyan-400 light:text-gray-900">
              TEMPORAL CONSTRAINTS
            </p>
            <div className="space-y-2">
              {/* <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-cyan-500"
                  onClick={(e) => dispatch({ type: 'DUE', payload: 'active' })}
                />
                <span className="light:text-gray-700">
                  Due this current sprint
                </span>
              </label> */}
              <label className="flex items-center gap-2 text-red-500">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={Boolean(filters.due)}
                  onChange={(e) =>
                    dispatcher(
                      setFilters({
                        key: 'due',
                        value: e.target?.['checked']
                          ? moment().toISOString()
                          : '',
                      }),
                    )
                  }
                />
                <span>Overdue assets</span>
              </label>
            </div>
          </div>
        </div>

        <footer className="flex justify-between items-center px-6 py-4 border-t border-gray-700 flex-shrink-0">
          <button
            className="text-gray-500 hover:text-cyan-400 uppercase text-sm font-semibold tracking-wide cursor-pointer"
            onClick={() => {
              dispatcher(addFilteredTasks(null));
              dispatcher(clearAll());
              closePanel();
            }}
          >
            Clear All
          </button>
          <button
            className="bg-cyan-500 px-4 py-2 rounded-md font-semibold hover:bg-cyan-600 transition light:text-white cursor-pointer"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FilterOverlay;
