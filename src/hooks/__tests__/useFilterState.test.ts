// src/hooks/__tests__/useFilterState.test.ts

import { createEmptyGroup, createEmptyCondition } from '@/utils/initState';
import { filterReducer } from '@/hooks/useFilterState';
import { FilterAction } from '@/types/filterActions';

describe('filterReducer', () => {
  test('RESET returns a new empty group', () => {
    const initial = createEmptyGroup('and');
    const next = filterReducer(initial, { type: 'RESET' });
    expect(next.id).not.toBe(initial.id);
    expect(next.children).toEqual([]);
    expect(next.type).toBe('group');
  });

  test('ADD_CONDITION adds a new condition', () => {
    const group = createEmptyGroup('and');
    const condition = createEmptyCondition();
    const action: FilterAction = { type: 'ADD_CONDITION', groupId: group.id, condition };
    const result = filterReducer(group, action);
    expect(result.children).toContainEqual(condition);
  });

  test('UPDATE_CONDITION updates the field of a condition', () => {
    const condition = createEmptyCondition();
    const group = { ...createEmptyGroup('and'), children: [condition] };
    const action: FilterAction = {
      type: 'UPDATE_CONDITION',
      id: condition.id,
      updates: { field: 'name', conditionOperator: 'eq', value: 'test' },
    };
    const result = filterReducer(group, action);
    expect(result.children![0]).toMatchObject({ field: 'name', conditionOperator: 'eq', value: 'test' });
  });

  test('REMOVE_CONDITION removes a condition by id', () => {
    const condition = createEmptyCondition();
    const group = { ...createEmptyGroup('and'), children: [condition] };
    const action: FilterAction = { type: 'REMOVE_CONDITION', id: condition.id };
    const result = filterReducer(group, action);
    expect(result.children).toHaveLength(0);
  });

  test('ADD_GROUP adds a nested group', () => {
    const group = createEmptyGroup('and');
    const newGroup = createEmptyGroup('or');
    const action: FilterAction = { type: 'ADD_GROUP', parentId: group.id, group: newGroup };
    const result = filterReducer(group, action);
    expect(result.children).toContainEqual(newGroup);
  });

  test('UPDATE_GROUP changes the operator of a group', () => {
    const group = createEmptyGroup('and');
    const action: FilterAction = { type: 'UPDATE_GROUP', id: group.id, operator: 'or' };
    const result = filterReducer(group, action);
    expect(result.operator).toBe('or');
  });

  test('REMOVE_GROUP removes a nested group', () => {
    const nested = createEmptyGroup('and');
    const group = { ...createEmptyGroup('and'), children: [nested] };
    const action: FilterAction = { type: 'REMOVE_GROUP', id: nested.id };
    const result = filterReducer(group, action);
    expect(result.children).toHaveLength(0);
  });
});
