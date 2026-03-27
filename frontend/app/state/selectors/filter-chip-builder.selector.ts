import { createSelector } from '@reduxjs/toolkit';
import { selectAppliedFilters } from '../features/filters.slice';
import { selectUsersById } from '../features/project.slice';

export const selectFilterChips = createSelector(
  [selectAppliedFilters, selectUsersById],
  (filters, usersById) => {
    const chips: {}[] = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return;
        value.forEach((v) => {
          if (key == 'member') {
            chips.push({
              key,
              value: v,
              label: `member: ${usersById['byId'][v]?.name}`,
            });
          } else {
            chips.push({
              key,
              value: v,
              label: `${key}: ${v}`,
            });
          }
        });
      } else if (typeof value === 'string') {
        if (!value.trim()) return;
        chips.push({
          key,
          value,
          label: `${key}: ${value}`,
        });
      }
    });

    return chips;
  },
);
