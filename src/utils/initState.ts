// src/utils/initState.ts
import { FilterState, LogicalOperator } from '@/types/filter';

// Generate a simple unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function createEmptyGroup(operator: LogicalOperator = 'and'): FilterState {
  return {
    id: generateId(),
    type: 'group',
    operator,
    children: [],
  };
}

export function createEmptyCondition(): FilterState {
  return {
    id: generateId(),
    type: 'condition',
    field: undefined,
    conditionOperator: undefined,
    value: undefined,
  };
}