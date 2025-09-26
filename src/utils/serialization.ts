import { FilterState, FilterJSON, FilterConditionJSON } from '../types/filter';

/**
 * Recursively serialize FilterState to FilterJSON.
 */
export function serializeFilter(state: FilterState): FilterJSON {
  if (state.type === 'condition') {
    // Only serialize if we have complete condition data
    if (!state.field || !state.conditionOperator) {
      return {}; // Return empty object for incomplete conditions
    }
    
    const condition: FilterConditionJSON = {
      field: state.field,
      operator: state.conditionOperator,
    };
    
    // Handle both single values and arrays (for between operators)
    if (state.values !== undefined && Array.isArray(state.values)) {
      condition.value = state.values;
    } else if (state.value !== undefined) {
      condition.value = state.value;
    }
    
    return condition;
  }

  // Group node
  const children = state.children || [];
  
  // Filter out empty or invalid conditions
  const validChildren = children
    .map(serializeFilter)
    .filter(child => {
      // Filter out empty objects or invalid conditions
      if (typeof child === 'object' && Object.keys(child).length === 0) {
        return false;
      }
      // For conditions, check if they have required fields
      if ('field' in child && 'operator' in child) {
        return child.field && child.operator;
      }
      return true;
    });

  // Don't create empty groups
  if (validChildren.length === 0) {
    return {};
  }

  return {
    [state.operator || 'and']: validChildren,
  };
}

/**
 * Recursively deserialize FilterJSON into FilterState.
 */
export function deserializeFilter(json: FilterJSON): FilterState {
  // Handle empty or invalid JSON
  if (!json || typeof json !== 'object' || Object.keys(json).length === 0) {
    return createEmptyGroup('and');
  }

  // Determine if group
  const keys = Object.keys(json);
  if (keys.includes('and') || keys.includes('or')) {
    const operator = keys[0] as 'and' | 'or';
    const groupState: FilterState = {
      id: generateId(),
      type: 'group',
      operator,
      children: [],
    };
    
    const array = (json as any)[operator] as FilterJSON[];
    if (Array.isArray(array)) {
      groupState.children = array.map(deserializeFilter);
    }
    
    return groupState;
  }

  // Condition node
  const conditionState: FilterState = {
    id: generateId(),
    type: 'condition',
    field: (json as any).field,
    conditionOperator: (json as any).operator,
  };

  // Handle value assignment
  const value = (json as any).value;
  if (Array.isArray(value)) {
    conditionState.values = value;
  } else if (value !== undefined) {
    conditionState.value = value;
  }

  return conditionState;
}

// Simple unique ID generator
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Create empty group helper (if not available from initState)
function createEmptyGroup(operator: 'and' | 'or'): FilterState {
  return {
    id: generateId(),
    type: 'group',
    operator,
    children: [],
  };
}