'use client';

import { formatDate } from '@/app/utils/helperFunc';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import {
  BsChevronDoubleDown,
  BsChevronDoubleUp,
  BsChevronExpand,
} from 'react-icons/bs';
import { FaPaperclip, FaRegClock, FaRegCommentDots } from 'react-icons/fa6';
import { TaskCardKebabMenu } from './taskCardKebabMenu';
import { TaskDetailModal } from './taskDetailModal';

export const TaskCard = ({ card, owner, border, color, overlay = false }) => {
  const [taskDetailDialogOpen, setTaskDetailDialogOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'task',
      columnId: card.status,
      column: card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const getPriorityIcon = (priority) => {
    if (priority == 'high') {
      return <BsChevronDoubleUp color="red" />;
    } else if (priority == 'medium') {
      return <BsChevronExpand color="orange" />;
    } else {
      return <BsChevronDoubleDown color="green" />;
    }
  };

  return (
    <div
      className={`dark:bg-white/10 light:bg-white shadow-lg hover:shadow-xl rounded-md cursor-pointer hover:bg-white/12 transition relative border-l-4 ${border} min-h-[160px] flex flex-col`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        setTaskDetailDialogOpen(true);
      }}
    >
      <div className="flex flex-col h-full p-5 pb-3 rounded-lg flex-1">
        <TaskCardKebabMenu card={card} />
        <h3 className="flex items-center text-md font-semibold">
          <span className="mr-2">
            {getPriorityIcon(card?.priority?.toLowerCase())}
          </span>
          <span className=" max-w-[10rem] lines-ellipsis">{card?.title}</span>
        </h3>
        <p className="mt-2 lines-ellipsis two text-sm">{card.description}</p>
        <p className="flex items-center gap-2 text-xs mt-6"><FaRegClock color={'red'}/> {formatDate(card.dueDate)}</p>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaRegCommentDots /> {card?.commentsCount}
            </span>
            <span className="flex items-center gap-1">
              <FaPaperclip /> {card?.attachmentsCount}
            </span>
          </p>
          <div className="flex -space-x-2">
            {card.assignee.name != owner.name && (
              <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-700 text-gray-100 flex items-center justify-center">
                {card.assignee.name[0]}
              </div>
            )}
            <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-700 text-gray-100 flex items-center justify-center">
              {owner.name[0]}
            </div>
          </div>
        </div>
      </div>

      {taskDetailDialogOpen && (
        <TaskDetailModal
          isOpen={taskDetailDialogOpen}
          onClose={(e) => {
            e?.stopPropagation();
            setTaskDetailDialogOpen(false);
          }}
          task={card}
          priorityIcon={getPriorityIcon}
          color={color}
        />
      )}
    </div>
  );
};
