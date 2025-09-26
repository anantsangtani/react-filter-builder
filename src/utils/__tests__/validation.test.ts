import { createEmptyGroup, createEmptyCondition } from '@/utils/initState';
import { validateFilter } from '@/utils/validation';
import { SchemaConfig } from '@/types/schema';

const schema: SchemaConfig = {
  fields: {
    age: { type: 'number', label: 'Age' },
    name: { type: 'string', label: 'Name' },
  },
  operators: {
    number: ['gt', 'lt'],
    string: ['eq', 'contains'],
    boolean: [],
    date: [],
  },
};

describe('validation', () => {
  test('valid condition passes', () => {
    const cond = createEmptyCondition();
    cond.field = 'age';
    cond.conditionOperator = 'gt';
    cond.value = 18;
    const { isValid, errors } = validateFilter(cond, schema);
    expect(isValid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test('missing field fails', () => {
    const cond = createEmptyCondition();
    cond.conditionOperator = 'gt';
    cond.value = 18;
    const { isValid, errors } = validateFilter(cond, schema);
    expect(isValid).toBe(false);
    expect(errors[0]).toMatch(/field is required/);
  });

  test('unknown field fails', () => {
    const cond = createEmptyCondition();
    cond.field = 'unknown';
    cond.conditionOperator = 'eq';
    cond.value = 'x';
    const { isValid, errors } = validateFilter(cond, schema);
    expect(isValid).toBe(false);
    expect(errors[0]).toMatch(/unknown field/);
  });
});
