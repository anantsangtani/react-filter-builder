// src/components/FilterCondition/FilterCondition.tsx

import React from 'react';
import { FilterState } from '@/types/filter';
import { SchemaConfig } from '@/types/schema';
import { FilterAction } from '@/types/filterActions';

interface FilterConditionProps {
  condition: FilterState;
  schema: SchemaConfig;
  dispatch: React.Dispatch<FilterAction>;
  disabled?: boolean;
}

const FilterCondition: React.FC<FilterConditionProps> = ({
  condition,
  schema,
  dispatch,
  disabled = false,
}) => {
  const fieldOptions = Object.keys(schema.fields);

  return (
    <div data-testid={`filter-condition-${condition.id}`}>
      <select
        value={condition.field || ''}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_CONDITION',
            id: condition.id,
            updates: { field: e.target.value },
          })
        }
        disabled={disabled}
      >
        <option value="">Select field</option>
        {fieldOptions.map((key) => (
          <option key={key} value={key}>
            {schema.fields[key].label}
          </option>
        ))}
      </select>

      <select
        value={condition.conditionOperator || ''}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_CONDITION',
            id: condition.id,
            updates: { conditionOperator: e.target.value },
          })
        }
        disabled={disabled || !condition.field}
      >
        <option value="">Select operator</option>
        {(schema.operators[schema.fields[condition.field!].type] || []).map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={condition.value as string || ''}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_CONDITION',
            id: condition.id,
            updates: { value: e.target.value },
          })
        }
        disabled={disabled || !condition.conditionOperator}
      />

      <button onClick={() => dispatch({ type: 'REMOVE_CONDITION', id: condition.id })} disabled={disabled}>
        ×
      </button>
    </div>
  );
};

export default FilterCondition;
