import { FilterState, FilterJSON, FilterConditionJSON } from '../types/filter';

/**
 * Recursively serialize FilterState to FilterJSON.
 */
export function serializeFilter(state: FilterState): FilterJSON {
  if (state.type === 'condition') {
    const condition: FilterConditionJSON = {
      field: state.field,
      operator: state.conditionOperator,
      value: state.value !== undefined ? state.value : state.values,
    };
    return condition;
  }

  // Group node
  const children = state.children || [];
  const serializedChildren = children.map(serializeFilter);
  return {
    [state.operator || 'and']: serializedChildren,
  };
}

/**
 * Recursively deserialize FilterJSON into FilterState.
 */
export function deserializeFilter(json: FilterJSON): FilterState {
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
    groupState.children = array.map(deserializeFilter);
    return groupState;
  }

  // Condition node
  const conditionState: FilterState = {
    id: generateId(),
    type: 'condition',
    field: (json as any).field,
    conditionOperator: (json as any).operator,
  };
  if ('value' in json) {
    conditionState.value = (json as any).value;
  } else {
    conditionState.values = (json as any).value;
  }
  return conditionState;
}

// Simple unique ID generator
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
