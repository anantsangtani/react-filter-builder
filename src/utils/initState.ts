// src/utils/initState.ts

import { FilterState, LogicalOperator } from '../types/filter';

// Simple unique ID generator fallback
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export const createEmptyGroup = (operator: LogicalOperator = 'and'): FilterState => ({
  id: generateId(),
  type: 'group',
  operator,
  children: []
});

export const createEmptyCondition = (): FilterState => ({
  id: generateId(),
  type: 'condition'
});