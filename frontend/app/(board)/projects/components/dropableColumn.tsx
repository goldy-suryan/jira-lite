import { useDroppable } from '@dnd-kit/core';

export const DroppableColumn = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'column',
      columnId: id,
    },
  });

  return (
    <div ref={setNodeRef} className="h-full">
      {children}
    </div>
  );
};