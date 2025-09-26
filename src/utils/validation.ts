import { FilterState } from '../types/filter';
import { SchemaConfig } from '../types/schema';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate entire filter tree against the schema.
 */
export function validateFilter(
  state: FilterState,
  schema: SchemaConfig
): ValidationResult {
  const errors: string[] = [];

  function recurse(node: FilterState) {
    if (node.type === 'condition') {
      const { field, conditionOperator, value, values } = node;
      if (!field) {
        errors.push(`Condition ${node.id}: field is required`);
        return;
      }
      const fieldConfig = schema.fields[field];
      if (!fieldConfig) {
        errors.push(`Condition ${node.id}: unknown field ${field}`);
        return;
      }
      if (!conditionOperator) {
        errors.push(`Condition ${node.id}: operator is required`);
        return;
      }
      // Value presence based on operator
      if (
        ['is_null', 'is_not_null'].includes(conditionOperator) === false &&
        (value === undefined && values === undefined)
      ) {
        errors.push(`Condition ${node.id}: value is required`);
      }
    } else {
      // Group
      (node.children || []).forEach(recurse);
    }
  }

  recurse(state);
  return { isValid: errors.length === 0, errors };
}
