import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCardKebabMenu } from './taskCardKebabMenu';

export const TaskCard = ({ card, overlay = false }) => {
  const priorityBackground = (priority: string) => {
    let lowerCasePriority = priority?.toLowerCase();
    if (lowerCasePriority == 'low') {
      return {
        priorityColor: 'bg-green-600',
        borderColor: 'border-l-green-600',
      };
    } else if (lowerCasePriority == 'medium') {
      return {
        priorityColor: 'bg-orange-600',
        borderColor: 'border-l-orange-600',
      };
    } else {
      return { priorityColor: 'bg-red-800', borderColor: 'border-l-red-800' };
    }
  };

  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as any;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
    </div>
  );
};
