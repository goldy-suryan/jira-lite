import dayjs from 'dayjs';

export const debounce = (fn: Function, delay = 500) => {
  let timer;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

export const formatDate = (date: string | number, time = false) => {
  if (!time) return dayjs(date).format('MMM DD, YYYY');
  return dayjs(date).format('MMM DD, YYYY | HH:MM');
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

// Comparing dates ignoring time
function isSameDate(d1, d2) {
  return dayjs(d1).isSame(d2, 'day');
}

function isDate(value) {
  if (value instanceof Date) return true;
  if (dayjs.isDayjs(value)) return true;
  if (typeof value === 'string') {
    return dayjs(value).isValid();
  }
  return false;
}

export const isPartialDeepEqual = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || obj1 === null) {
    if (typeof obj1 === 'string' && typeof obj2 === 'string') {
      return obj1.toLowerCase() === obj2.toLowerCase();
    }

    if (isDate(obj1) && isDate(obj2)) {
      return isSameDate(obj1, obj2);
    }

    return obj1 === obj2;
  }

  if (typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  for (const key of Object.keys(obj1)) {
    if (!(key in obj2)) {
      return false;
    }
    if (!isPartialDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
