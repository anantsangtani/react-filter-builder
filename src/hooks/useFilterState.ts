// src/hooks/useFilterState.ts

import { useReducer } from 'react';
import { FilterState } from '@/types/filter';
import { FilterAction } from '@/types/filterActions';
import { createEmptyGroup } from '@/utils/initState';

// Reducer function
export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'ADD_CONDITION':
      if (state.type === 'group') {
        return {
          ...state,
          children: [...(state.children || []), action.condition]
        };
      }
      return state;

    case 'RESET':
      return createEmptyGroup('and');

    default:
      return state;
  }
}

// Hook
export function useFilterState(initialFilter?: FilterState) {
  return useReducer(filterReducer, initialFilter || createEmptyGroup('and'));
}