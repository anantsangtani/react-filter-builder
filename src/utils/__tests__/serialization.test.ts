import { createEmptyGroup, createEmptyCondition } from '@/utils/initState';
import { serializeFilter, deserializeFilter } from '@/utils/serialization';
import { FilterJSON } from '@/types/filter';

describe('serialization', () => {
  test('serialize simple condition', () => {
    const cond = createEmptyCondition();
    cond.field = 'age';
    cond.conditionOperator = 'gt';
    cond.value = 30;
    const json = serializeFilter(cond);
    expect(json).toEqual({ field: 'age', operator: 'gt', value: 30 });
  });

  test('serialize nested group', () => {
    const group = createEmptyGroup('and');
    const cond1 = createEmptyCondition();
    cond1.field = 'age';
    cond1.conditionOperator = 'gt';
    cond1.value = 30;
    const cond2 = createEmptyCondition();
    cond2.field = 'isActive';
    cond2.conditionOperator = 'eq';
    cond2.value = true;
    group.children = [cond1, cond2];
    const json = serializeFilter(group) as FilterJSON;
    expect(json).toHaveProperty('and');
    expect((json.and as any[]).length).toBe(2);
  });

  test('deserialize simple JSON', () => {
    const json: FilterJSON = { field: 'age', operator: 'lt', value: 20 };
    const state = deserializeFilter(json);
    expect(state.type).toBe('condition');
    expect(state.field).toBe('age');
    expect(state.conditionOperator).toBe('lt');
    expect(state.value).toBe(20);
  });

  test('deserialize nested JSON', () => {
    const json: FilterJSON = {
      and: [
        { field: 'age', operator: 'gt', value: 30 },
        { or: [{ field: 'role', operator: 'eq', value: 'admin' }] },
      ],
    };
    const state = deserializeFilter(json);
    expect(state.type).toBe('group');
    expect(state.operator).toBe('and');
    expect(state.children?.[1].type).toBe('group');
    expect(state.children?.[1].operator).toBe('or');
  });
});
