import { generateQueryString, generateRequestBody } from '@/utils/api';

describe('API Utils', () => {
  const filterJson = {
    and: [
      { field: 'age', operator: 'gt', value: 18 },
      { field: 'name', operator: 'contains', value: 'John' },
    ],
  };

  test('generateQueryString generates correct string', () => {
    const qs = generateQueryString(filterJson);
    expect(qs).toContain('cond%5B0%5D.field=age');
    expect(qs).toContain('cond%5B0%5D.op=gt');
    expect(qs).toContain('cond%5B0%5D.value=18');
    expect(qs).toContain('cond%5B1%5D.field=name');
    expect(qs).toContain('cond%5B1%5D.op=contains');
    expect(qs).toContain('cond%5B1%5D.value=John');
  });

  test('generateRequestBody returns filter JSON', () => {
    const body = generateRequestBody(filterJson);
    expect(body).toEqual(filterJson);
  });
});
