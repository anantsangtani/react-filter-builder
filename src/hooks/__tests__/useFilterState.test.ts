// src/hooks/__tests__/useFilterState.test.ts

import { createEmptyGroup, createEmptyCondition } from '@/utils/initState';
import { filterReducer } from '@/hooks/useFilterState';
import { FilterAction } from '@/types/filterActions';

describe('filterReducer', () => {
  test('RESET returns a new empty group', () => {
    const initial = createEmptyGroup('and');
    const next = filterReducer(initial, { type: 'RESET' });
    expect(next.type).toBe('group');
    expect(next.operator).toBe('and');
    expect(next.children).toEqual([]);
    expect(next.id).not.toBe(initial.id);
  });

  test('ADD_CONDITION adds a new condition to the specified group', () => {
    const group = createEmptyGroup('and');
    const condition = createEmptyCondition();
    const action: FilterAction = { type: 'ADD_CONDITION', groupId: group.id, condition };
    const result = filterReducer(group, action);
    expect(result.children).toHaveLength(1);
    expect(result.children![0]).toEqual(condition);
  });
});