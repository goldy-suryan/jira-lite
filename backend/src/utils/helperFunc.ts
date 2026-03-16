import { GraphQLError } from 'graphql';

export function unauthorizedError() {
  return new GraphQLError('Unauthorized', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}

export const formatDate = (date: string | number, time = false) => {
  const parsedDate =
    typeof date === 'string' && /^\d+$/.test(date)
      ? new Date(Number(date))
      : new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (time) {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
      ...options,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return parsedDate.toLocaleString(undefined, dateTimeOptions);
  }
  return parsedDate.toLocaleDateString(undefined, options);
};