// Main library exports - this will be built by Rollup

// Export main component
export { default as FilterBuilder } from './components/FilterBuilder';

// Export types for consumers
export type {
  FilterBuilderProps,
  SchemaConfig,
  FieldConfig,
  FilterJSON,
  DataType,
  LogicalOperator,
  APIConfig
} from './types';

// Export utility functions that consumers might need
export { 
  serializeFilter,
  deserializeFilter 
} from './utils/serialization';

// Export default operators configuration
export { DEFAULT_OPERATORS } from './types/schema';
