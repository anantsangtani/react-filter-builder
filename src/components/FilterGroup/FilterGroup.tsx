// src/components/FilterGroup/FilterGroup.tsx

import React from 'react';
import { FilterState, LogicalOperator } from '@/types/filter';
import { SchemaConfig } from '@/types/schema';
import { FilterAction } from '@/types/filterActions';
import FilterCondition from '@/components/FilterCondition';
import { createEmptyGroup, createEmptyCondition } from '@/utils/initState';
import styles from './FilterGroup.module.css';

interface FilterGroupProps {
  filter: FilterState;
  schema: SchemaConfig;
  dispatch: React.Dispatch<FilterAction>;
  disabled?: boolean;
  level: number;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  filter,
  schema,
  dispatch,
  disabled = false,
  level,
}) => {
  const children = filter.children || [];

  return (
    <div className={styles.group} style={{ marginLeft: level * 20 }}>
      <div className={styles.controls}>
        <select
          className={styles.operatorSelect}
          value={filter.operator}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_GROUP', id: filter.id, operator: e.target.value as LogicalOperator })
          }
          disabled={disabled}
        >
          <option value="and">ALL of the following</option>
          <option value="or">ANY of the following</option>
        </select>
        {level > 0 && (
          <button 
            className={styles.removeButton}
            onClick={() => dispatch({ type: 'REMOVE_GROUP', id: filter.id })} 
            disabled={disabled}
          >
            Remove Group
          </button>
        )}
      </div>

      {children.map((child) =>
        child.type === 'condition' ? (
          <FilterCondition 
            key={child.id} 
            condition={child} 
            schema={schema} 
            dispatch={dispatch} 
            disabled={disabled} 
          />
        ) : (
          <FilterGroup 
            key={child.id} 
            filter={child} 
            schema={schema} 
            dispatch={dispatch} 
            disabled={disabled} 
            level={level + 1} 
          />
        )
      )}

      <div className={styles.addButtons}>
        <button 
          className={styles.addButton}
          onClick={() => dispatch({ 
            type: 'ADD_CONDITION', 
            groupId: filter.id, 
            condition: createEmptyCondition() 
          })} 
          disabled={disabled}
        >
          Add Condition
        </button>
        <button 
          className={styles.addButton}
          onClick={() => dispatch({ 
            type: 'ADD_GROUP', 
            parentId: filter.id, 
            group: createEmptyGroup('and') 
          })} 
          disabled={disabled}
        >
          Add Group
        </button>
      </div>
    </div>
  );
};

export default FilterGroup;