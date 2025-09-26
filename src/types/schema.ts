// src/types/schema.ts

export type DataType = 'string' | 'number' | 'boolean' | 'date';

export interface FieldConfig {
  type: DataType;
  label: string;
  options?: Array<{ label: string; value: string | number }>;
  required?: boolean;
}

export interface SchemaConfig {
  fields: Record<string, FieldConfig>;
  operators: Record<DataType, string[]>;
}

export const DEFAULT_OPERATORS: Record<DataType, string[]> = {
  string: ['eq', 'neq', 'contains', 'starts_with', 'ends_with'],
  number: ['eq', 'neq', 'gt', 'lt', 'between'],
  boolean: ['eq', 'neq'],
  date: ['eq', 'neq', 'before', 'after', 'between']
};
