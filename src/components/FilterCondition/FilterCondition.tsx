// src/components/FilterCondition/FilterCondition.tsx

import React from 'react';
import { FilterState } from '@/types/filter';
import { FilterAction } from '@/types/filterActions';
import { SchemaConfig } from '@/types/schema';
import ValueInput from '@/components/ValueInput';
import styles from './FilterCondition.module.css';

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
  const { field, conditionOperator, value, values } = condition;
  const fields = Object.entries(schema.fields);
  const selectedField = field ? schema.fields[field] : null;

  return (
    <div className={styles.condition}>  
      <select
        className={styles.select}
        value={field || ''}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_CONDITION',
            id: condition.id,
            updates: { field: e.target.value, conditionOperator: '', value: undefined, values: undefined },
          })
        }
        disabled={disabled}
      >
        <option value="">Select Field</option>
        {fields.map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={conditionOperator || ''}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_CONDITION',
            id: condition.id,
            updates: { conditionOperator: e.target.value, value: undefined, values: undefined },
          })
        }
        disabled={disabled || !selectedField}
      >
        <option value="">Select Operator</option>
        {selectedField &&
          schema.operators[selectedField.type].map((op) => (
            <option key={op} value={op}>
              {op.replace('_', ' ').toUpperCase()}
            </option>
          ))}
      </select>

      {selectedField && conditionOperator && (
        <ValueInput
          fieldConfig={selectedField}
          operator={conditionOperator}
          value={value}
          values={values}
          onChange={(val, vals) =>
            dispatch({
              type: 'UPDATE_CONDITION',
              id: condition.id,
              updates: { value: val, values: vals },
            })
          }
          disabled={disabled}
        />
      )}

      <button
        className={styles.removeConditionButton}
        onClick={() => dispatch({ type: 'REMOVE_CONDITION', id: condition.id })}
        disabled={disabled}
        title="Remove condition"
      >
        ×
      </button>
    </div>
  );
};

export default FilterCondition;