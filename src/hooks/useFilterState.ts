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
    const updatedChildren = current.children.map(child => updateNode(child, id, updater));
    return {
      ...current,
      children: updatedChildren,
    };
  }
  
  return current;
}

// Recursive helper to remove a node by id
function removeNode(current: FilterState, id: string): FilterState {
  if (current.children) {
    const filteredChildren = current.children.filter(child => child.id !== id);
    const updatedChildren = filteredChildren.map(child => removeNode(child, id));
    return {
      ...current,
      children: updatedChildren,
    };
  }
  return current;
}

// Reducer function with better error handling
export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'ADD_CONDITION':
      const stateAfterAddCondition = updateNode(state, action.groupId, node => {
        if (node.type !== 'group') {
          console.warn('Trying to add condition to non-group node:', node);
          return node;
        }
        return {
          ...node,
          children: [...(node.children || []), action.condition],
        };
      });
      return stateAfterAddCondition;

    case 'ADD_GROUP':
      const stateAfterAddGroup = updateNode(state, action.parentId, node => {
        if (node.type !== 'group') {
          console.warn('Trying to add group to non-group node:', node);
          return node;
        }
        return {
          ...node,
          children: [...(node.children || []), action.group],
        };
      });
      return stateAfterAddGroup;

    case 'UPDATE_CONDITION':
      return updateNode(state, action.id, (node) => {
        if (node.type !== 'condition') {
          console.warn('Trying to update non-condition node:', node);
          return node;
        }
        return { ...node, ...action.updates };
      });

    case 'REMOVE_CONDITION':
    case 'REMOVE_GROUP':
      return removeNode(state, action.id);

    case 'UPDATE_GROUP':
      return updateNode(state, action.id, node => {
        if (node.type !== 'group') {
          console.warn('Trying to update operator on non-group node:', node);
          return node;
        }
        return { ...node, operator: action.operator };
      });

    case 'RESET':
      return createEmptyGroup('and');

    default:
      return state;
  }
}

// Hook with debug logging
export function useFilterState(initialFilter?: FilterState) {
  const initial = initialFilter || createEmptyGroup('and');
  
  return useReducer(filterReducer, initial);
}