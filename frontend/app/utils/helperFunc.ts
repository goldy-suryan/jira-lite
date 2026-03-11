export const debounce = (fn: Function, delay = 500) => {
  let timer;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

export const formatDate = (date: string | number) => {
  const parsedDate =
    typeof date === 'string' && /^\d+$/.test(date)
      ? new Date(Number(date))
      : new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return parsedDate.toLocaleDateString(undefined, options);
};

export const priorityBackground = (priority: string) => {
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
