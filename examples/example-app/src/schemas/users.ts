export const usersSchema = {
  fields: {
    age: { type: 'number', label: 'Age' },
    name: { type: 'string', label: 'Name' },
    isActive: { type: 'boolean', label: 'Active' },
    createdAt: { type: 'date', label: 'Created Date' },
  },
  operators: {
    string: ['eq', 'neq', 'contains', 'starts_with', 'ends_with'],
    number: ['eq', 'neq', 'gt', 'lt', 'between'],
    boolean: ['eq', 'neq'],
    date: ['eq', 'neq', 'before', 'after', 'between'],
  },
};
