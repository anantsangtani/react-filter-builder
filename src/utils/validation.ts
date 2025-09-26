// Fixed validation.ts with proper undefined handling
// src/utils/validation.ts
import { FilterState } from '../types/filter';
import { SchemaConfig, VALUE_OPTIONAL_OPERATORS, MULTI_VALUE_OPERATORS } from '../types/schema';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationError {
  nodeId: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Comprehensive filter validation with enhanced operator support
 */
export function validateFilter(
  state: FilterState,
  schema: SchemaConfig,
  options: { 
    allowEmptyGroups?: boolean;
    allowIncompleteConditions?: boolean;
  } = {}
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const { allowEmptyGroups = false, allowIncompleteConditions = false } = options;

  function validateNode(node: FilterState, path: string[] = []): void {
    const currentPath = [...path, node.id];
    const pathString = currentPath.join(' > ');

    if (node.type === 'condition') {
      validateCondition(node, pathString);
    } else if (node.type === 'group') {
      validateGroup(node, pathString);
    }
  }

  function validateCondition(node: FilterState, path: string): void {
    const { field, conditionOperator, value, values } = node;

    // Check if field is selected
    if (!field) {
      if (!allowIncompleteConditions) {
        errors.push(`${path}: Field is required`);
      } else {
        warnings.push(`${path}: No field selected`);
      }
      return;
    }

    // Check if field exists in schema
    const fieldConfig = schema.fields[field];
    if (!fieldConfig) {
      errors.push(`${path}: Unknown field "${field}"`);
      return;
    }

    // Check if operator is selected
    if (!conditionOperator) {
      if (!allowIncompleteConditions) {
        errors.push(`${path}: Operator is required`);
      } else {
        warnings.push(`${path}: No operator selected`);
      }
      return;
    }

    // Check if operator is valid for field type
    const validOperators = schema.operators[fieldConfig.type];
    if (!validOperators.includes(conditionOperator)) {
      errors.push(`${path}: Operator "${conditionOperator}" is not valid for field type "${fieldConfig.type}"`);
      return;
    }

    // Validate value requirements based on operator
    validateConditionValue(node, fieldConfig, path);
  }

  function validateConditionValue(
    node: FilterState, 
    fieldConfig: any, 
    path: string
  ): void {
    const { conditionOperator, value, values } = node;

    // Early return if no operator (already handled above)
    if (!conditionOperator) return;

    // Operators that don't require values
    if (VALUE_OPTIONAL_OPERATORS.includes(conditionOperator)) {
      if (value !== undefined || values !== undefined) {
        warnings.push(`${path}: Operator "${conditionOperator}" doesn't require a value`);
      }
      return;
    }

    // Multi-value operators
    if (MULTI_VALUE_OPERATORS.includes(conditionOperator)) {
      if (!values || !Array.isArray(values)) {
        errors.push(`${path}: Operator "${conditionOperator}" requires multiple values`);
        return;
      }

      // Check for "between" operator specifically (needs exactly 2 values)
      if (conditionOperator === 'between') {
        if (values.length !== 2) {
          errors.push(`${path}: "between" operator requires exactly 2 values`);
          return;
        }
        
        const [min, max] = values;
        if (min === '' || max === '' || min === undefined || max === undefined) {
          errors.push(`${path}: "between" operator requires both min and max values`);
          return;
        }

        // For number fields, validate that min < max
        if (fieldConfig.type === 'number') {
          const numMin = Number(min);
          const numMax = Number(max);
          if (!isNaN(numMin) && !isNaN(numMax) && numMin >= numMax) {
            errors.push(`${path}: Minimum value must be less than maximum value`);
          }
        }

        // For date fields, validate date format and order
        if (fieldConfig.type === 'date') {
          const dateMin = new Date(min);
          const dateMax = new Date(max);
          if (isNaN(dateMin.getTime()) || isNaN(dateMax.getTime())) {
            errors.push(`${path}: Invalid date format in "between" values`);
          } else if (dateMin >= dateMax) {
            errors.push(`${path}: Start date must be before end date`);
          }
        }
      }

      // Check for "in" and "not_in" operators
      if (conditionOperator === 'in' || conditionOperator === 'not_in') {
        if (values.length === 0) {
          errors.push(`${path}: "${conditionOperator}" operator requires at least one value`);
          return;
        }

        // Check for empty values
        const emptyValues = values.filter(v => v === '' || v === undefined || v === null);
        if (emptyValues.length > 0) {
          errors.push(`${path}: "${conditionOperator}" operator contains empty values`);
        }

        // For fields with options, validate that values exist in options
        if (fieldConfig.options) {
          const validValues = fieldConfig.options.map((opt: any) => opt.value);
          const invalidValues = values.filter(v => !validValues.includes(v));
          if (invalidValues.length > 0) {
            errors.push(`${path}: Invalid values for field "${node.field}": ${invalidValues.join(', ')}`);
          }
        }
      }
    } else {
      // Single-value operators
      if (value === undefined || value === '' || value === null) {
        if (!allowIncompleteConditions) {
          errors.push(`${path}: Value is required for operator "${conditionOperator}"`);
        } else {
          warnings.push(`${path}: No value provided for operator "${conditionOperator}"`);
        }
        return;
      }

      // Type-specific validation
      validateFieldValue(node, fieldConfig, path);
    }
  }

  function validateFieldValue(
    node: FilterState, 
    fieldConfig: any, 
    path: string
  ): void {
    const { value, field } = node;

    if (value === undefined || value === '' || value === null) {
      return; // Already handled in validateConditionValue
    }

    // Number field validation
    if (fieldConfig.type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors.push(`${path}: "${value}" is not a valid number for field "${field}"`);
      }
    }

    // Date field validation
    if (fieldConfig.type === 'date') {
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        errors.push(`${path}: "${value}" is not a valid date for field "${field}"`);
      }
    }

    // Boolean field validation
    if (fieldConfig.type === 'boolean') {
      if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
        errors.push(`${path}: "${value}" is not a valid boolean for field "${field}"`);
      }
    }

    // Options field validation
    if (fieldConfig.options) {
      const validValues = fieldConfig.options.map((opt: any) => opt.value);
      if (!validValues.includes(value)) {
        errors.push(`${path}: "${value}" is not a valid option for field "${field}"`);
      }
    }
  }

  function validateGroup(node: FilterState, path: string): void {
    const children = node.children || [];

    // Check for empty groups
    if (children.length === 0) {
      if (!allowEmptyGroups) {
        errors.push(`${path}: Group must contain at least one condition or child group`);
      } else {
        warnings.push(`${path}: Empty group`);
      }
      return;
    }

    // Validate operator
    if (!node.operator || (node.operator !== 'and' && node.operator !== 'or')) {
      errors.push(`${path}: Group must have a valid logical operator (and/or)`);
    }

    // Validate children
    children.forEach((child, index) => {
      validateNode(child, [...path.split(' > '), `child-${index}`]);
    });

    // Check for groups with only one child (might be unnecessary nesting)
    if (children.length === 1) {
      warnings.push(`${path}: Group contains only one item - consider simplifying`);
    }
  }

  // Start validation from root
  validateNode(state);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a specific condition in real-time
 */
export function validateConditionRealTime(
  condition: FilterState,
  schema: SchemaConfig
): ValidationError[] {
  const validationErrors: ValidationError[] = [];
  const result = validateFilter(condition, schema, { 
    allowEmptyGroups: true, 
    allowIncompleteConditions: true 
  });

  result.errors.forEach(error => {
    validationErrors.push({
      nodeId: condition.id,
      field: condition.field,
      message: error,
      severity: 'error'
    });
  });

  result.warnings.forEach(warning => {
    validationErrors.push({
      nodeId: condition.id,
      field: condition.field,
      message: warning,
      severity: 'warning'
    });
  });

  return validationErrors;
}

/**
 * Check if a filter is ready for submission (has at least one complete condition)
 */
export function isFilterComplete(state: FilterState, schema: SchemaConfig): boolean {
  function hasCompleteCondition(node: FilterState): boolean {
    if (node.type === 'condition') {
      const { field, conditionOperator, value, values } = node;
      
      if (!field || !conditionOperator) return false;
      
      const fieldConfig = schema.fields[field];
      if (!fieldConfig) return false;
      
      // Check value requirements
      if (VALUE_OPTIONAL_OPERATORS.includes(conditionOperator)) {
        return true; // These operators don't need values
      }
      
      if (MULTI_VALUE_OPERATORS.includes(conditionOperator)) {
        // Fix: Break down the complex boolean expression
        if (!values || !Array.isArray(values) || values.length === 0) {
          return false;
        }
        // Now we know values exists and is a non-empty array
        return values.every(v => v !== '' && v !== undefined && v !== null);
      }
      
      return value !== undefined && value !== '' && value !== null;
    }
    
    if (node.type === 'group' && node.children) {
      return node.children.some(hasCompleteCondition);
    }
    
    return false;
  }
  
  return hasCompleteCondition(state);
}