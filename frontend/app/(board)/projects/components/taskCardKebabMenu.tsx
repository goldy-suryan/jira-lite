'use client';

import { DELETE_TASK } from '@/app/graphql/mutations/board.mutation';
import { GET_PROJECT_BY_ID } from '@/app/graphql/queries/board.query';
import { useMutation } from '@apollo/client/react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';
import { ConfirmDialog } from '../../components/confirmDialog';
import { CreateOrUpdateTaskModal } from './createOrUpdateTaskModal';

export const TaskCardKebabMenu = ({ card }) => {
  const params = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [removeTask] = useMutation(DELETE_TASK, {
    refetchQueries: [
      {
        query: GET_PROJECT_BY_ID,
        variables: { projectId: params.projectId },
      },
    ],
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deleteTask = async () => {
    try {
      await removeTask({
        variables: {
          taskId: card.id,
        },
      });
    } catch (e) {
      console.log(e, 'error while deleting task');
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
        className="absolute top-2 right-2 p-1 rounded hover:bg-white/5 cursor-pointer"
        aria-label="Open task menu"
      >
        <FaEllipsis size={20}/>
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-8 right-2 light:bg-white dark:bg-zinc-900 rounded shadow-lg w-40 z-50"
        >
          <button
            className="block w-full text-left px-4 py-2 dark:hover:bg-zinc-700 light:hover:bg-gray-200 cursor-pointer"
            onClick={(e) => {
              e?.stopPropagation();
              setMenuOpen(false);
              setModalOpen(true);
            }}
          >
            Edit Task
          </button>
          <button
            className="block w-full text-left px-4 py-2 dark:hover:bg-zinc-700 light:hover:bg-gray-200 cursor-pointer"
            onClick={(e) => {
              e?.stopPropagation();
              setMenuOpen(false);
              setOpenDialog(true);
            }}
          >
            Delete Task
          </button>
        </div>
      )}
      {openDialog && (
        <ConfirmDialog
          heading="Confirm Delete"
          isOpen={openDialog}
          onConfirm={deleteTask}
          onCancel={() => {
            setOpenDialog(false);
          }}
          message="Are you sure you want to delete the task?"
          btnText="Delete"
        />
      )}
      {modalOpen && (
        <CreateOrUpdateTaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          task={card}
        />
      )}
    </>
  );
};
