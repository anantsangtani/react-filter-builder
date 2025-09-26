// Update src/hooks/useFilterState.ts to fix ADD_CONDITION and ADD_GROUP recursion

import { useReducer } from 'react';
import { FilterState, LogicalOperator } from '@/types/filter';
import { FilterAction } from '@/types/filterActions';
import { createEmptyGroup } from '@/utils/initState';

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
      children: current.children.map(child => updateNode(child, id, updater)),
    };
  }
  return current;
}

// Recursive helper to remove a node by id
function removeNode(current: FilterState, id: string): FilterState {
  if (current.children) {
    const filteredChildren = current.children.filter(child => child.id !== id);
    return {
      ...current,
      children: filteredChildren.map(child => removeNode(child, id)),
    };
  }
  return current;
}

// Reducer function
export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'ADD_CONDITION':
      return updateNode(state, action.groupId, node => ({
        ...node,
        children: [...(node.children || []), action.condition],
      }));

    case 'ADD_GROUP':
      return updateNode(state, action.parentId, node => ({
        ...node,
        children: [...(node.children || []), action.group],
      }));

    case 'UPDATE_CONDITION':
      return updateNode(state, action.id, (node) => ({...node, ...action.updates}));

    case 'REMOVE_CONDITION':
    case 'REMOVE_GROUP':
      return removeNode(state, action.id);

    case 'UPDATE_GROUP':
      return updateNode(state, action.id, node => ({...node, operator: action.operator}));

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