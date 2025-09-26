export type DataType = 'string' | 'number' | 'boolean' | 'date';

// Make all optional properties truly optional in the interface
export interface FieldConfig {
  type: DataType;
  label: string;
  options?: Array<{ label: string; value: string | number }>;
  required?: boolean;
  nullable?: boolean;
}

export interface SchemaConfig {
  fields: Record<string, FieldConfig>;
  operators: Record<DataType, string[]>;
}

export const DEFAULT_OPERATORS: Record<DataType, string[]> = {
  string: ['eq', 'neq', 'contains', 'starts_with', 'ends_with', 'in', 'not_in', 'is_null', 'is_not_null'],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'in', 'not_in', 'is_null', 'is_not_null'],
  boolean: ['eq', 'neq', 'is_null', 'is_not_null'],
  date: ['eq', 'neq', 'before', 'after', 'between', 'is_null', 'is_not_null']
};

// Human-readable operator labels
export const OPERATOR_LABELS: Record<string, string> = {
  eq: 'equals',
  neq: 'not equals',
  gt: 'greater than',
  gte: 'greater than or equal',
  lt: 'less than',
  lte: 'less than or equal',
  contains: 'contains',
  starts_with: 'starts with',
  ends_with: 'ends with',
  between: 'between',
  in: 'in',
  not_in: 'not in',
  before: 'before',
  after: 'after',
  is_null: 'is empty',
  is_not_null: 'is not empty'
};

// Operators that require no value input
export const VALUE_OPTIONAL_OPERATORS = ['is_null', 'is_not_null'];

// Operators that require multiple values
export const MULTI_VALUE_OPERATORS = ['between', 'in', 'not_in'];

// Operators that require exactly two values
export const TWO_VALUE_OPERATORS = ['between'];

// Type guard functions for better type safety
export function hasRequiredProperty(field: FieldConfig): field is FieldConfig & { required: boolean } {
  return 'required' in field;
}

export function hasNullableProperty(field: FieldConfig): field is FieldConfig & { nullable: boolean } {
  return 'nullable' in field;
}

export function hasOptionsProperty(field: FieldConfig): field is FieldConfig & { options: Array<{ label: string; value: string | number }> } {
  return 'options' in field && Array.isArray(field.options);
}