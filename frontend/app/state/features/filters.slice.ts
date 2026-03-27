import { filtersConst } from '@/app/utils/constants';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appliedFilters: localStorage.getItem('filters')
    ? JSON.parse(localStorage.getItem('filters') as string)
    : filtersConst,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const { key, value } = action.payload;
      state.appliedFilters[key] = value;
      localStorage.setItem('filters', JSON.stringify(state.appliedFilters));
    },

    toggleFilters: (state, action) => {
      const { key, value } = action.payload;
      const arr = state.appliedFilters[key];
      const index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(value);
      }
      localStorage.setItem('filters', JSON.stringify(state.appliedFilters));
    },

    removeFilter: (state, action) => {
      const { key, value } = action.payload;
      if (Array.isArray(state.appliedFilters[key])) {
        state.appliedFilters[key] = state.appliedFilters[key].filter(
          (v) => v != value,
        );
      } else {
        state.appliedFilters[key] = '';
      }
      localStorage.setItem('filters', JSON.stringify(state.appliedFilters));
    },

    clearAll: (state) => {
      state.appliedFilters = initialState.appliedFilters;
      localStorage.removeItem('filters');
    },
  },
});

export const { setFilters, toggleFilters, removeFilter, clearAll } =
  filterSlice.actions;
export const selectAppliedFilters = (state) => state.filters.appliedFilters;
export default filterSlice.reducer;
