// src/hooks/useFilterState.ts

import { useReducer } from 'react';
import { FilterState, LogicalOperator } from '@/types/filter';
import { FilterAction } from '@/types/filterActions';
import { createEmptyGroup, createEmptyCondition } from '@/utils/initState';

// Reducer function
export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'ADD_CONDITION':
      if (state.type === 'group') {
        return { ...state, children: [...(state.children || []), action.condition] };
      }
      return state;

    case 'UPDATE_CONDITION':
      return updateNode(state, action.id, (node) => ({
        ...node,
        ...action.updates,
      }));

    case 'REMOVE_CONDITION':
      return removeNode(state, action.id);

    case 'ADD_GROUP':
      if (state.id === action.parentId && state.type === 'group') {
        return { ...state, children: [...(state.children || []), action.group] };
      }
      return state;

    case 'UPDATE_GROUP':
      return updateNode(state, action.id, (node) => ({
        ...node,
        operator: action.operator,
      }));

    case 'REMOVE_GROUP':
      return removeNode(state, action.id);

    case 'RESET':
      return createEmptyGroup('and');

    default:
      return state;
  }
}

// Recursive helper to update a specific node by id
function updateNode(
  current: FilterState,
  id: string,
  updater: (node: FilterState) => FilterState
): FilterState {
  if (current.id === id) {
    return updater(current);
  }
  if (current.children) {
    return {
      ...current,
      children: current.children.map((child) => updateNode(child, id, updater)),
    };
  }
  return current;
}

// Recursive helper to remove a node by id
function removeNode(current: FilterState, id: string): FilterState {
  if (current.children) {
    const filtered = current.children.filter((child) => child.id !== id);
    const updatedChildren = filtered.map((child) => removeNode(child, id));
    return { ...current, children: updatedChildren };
  }
  return current;
}

// Hook
export function useFilterState(initialFilter?: FilterState) {
  return useReducer(
    filterReducer,
    initialFilter || createEmptyGroup('and')
  );
}
