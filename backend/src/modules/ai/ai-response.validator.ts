const VALID_STATUS = new Set([
  'TODO',
  'IN_PROGRESS',
  'DONE',
  'IN_REVIEW',
  'READY_FOR_REVIEW',
]);
const VALID_PRIORITY = new Set(['LOW', 'MEDIUM', 'HIGH']);

export function validateAIResponse(data) {
  if (!data || typeof data !== 'object') {
    return { invalid: true };
  }

  const { title, description, status, priority, dueDate } = data;

  if (!title || typeof title !== 'string') {
    return { invalid: true };
  }

  if (status && !VALID_STATUS.has(status)) {
    return { invalid: true };
  }

  if (priority && !VALID_PRIORITY.has(priority)) {
    return { invalid: true };
  }

  if (dueDate && Number.isNaN(Date.parse(dueDate))) {
    return { invalid: true };
  }

  return {
    title,
    description: description || '',
    status: status || 'TODO',
    priority: priority || 'LOW',
    dueDate: dueDate || null,
  };
}
