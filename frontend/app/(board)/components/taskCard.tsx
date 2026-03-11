'use client';

import { formatDate, priorityBackground } from '@/app/utils/helperFunc';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { TaskCardKebabMenu } from './taskCardKebabMenu';
import { TaskDetailModal } from './taskDetailModal';

export const TaskCard = ({ card, overlay = false }) => {
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

  return (
    <div
      className={`bg-white/10 rounded-md p-4 cursor-pointer hover:bg-white/20 transition relative border-l-4 ${priorityBackground(card?.priority)?.borderColor}`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        setTaskDetailDialogOpen(true);
      }}
    >
      <TaskCardKebabMenu card={card} />
      <h3 className="text-white mb-4 text-md">{card?.title}</h3>
      <p className="text-xs">
        Priority:{' '}
        <span
          className={`${priorityBackground(card?.priority)?.priorityColor} text-white text-[10px] px-1 py-0.5 rounded`}
        >
          {card?.priority}
        </span>
      </p>
      <p className="text-white text-xs mt-2">
        Due Date: {formatDate(card.dueDate)}
      </p>
      <div className="flex flex-wrap gap-2"></div>
      {taskDetailDialogOpen && (
        <TaskDetailModal
          isOpen={taskDetailDialogOpen}
          onClose={(e) => {
            e?.stopPropagation();
            setTaskDetailDialogOpen(false);
          }}
          task={card}
        />
      )}
    </div>
  );
};
