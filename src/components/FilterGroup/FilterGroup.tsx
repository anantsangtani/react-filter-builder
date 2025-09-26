// src/components/FilterGroup/FilterGroup.tsx

import React from 'react';
import { FilterState, LogicalOperator } from '@/types/filter';
import { SchemaConfig } from '@/types/schema';
import { FilterAction } from '@/types/filterActions';
import FilterCondition from '@/components/FilterCondition';

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
    <div data-testid={`filter-group-${filter.id}`} style={{ marginLeft: level * 20 }}>
      <div>
        <select
          value={filter.operator}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_GROUP', id: filter.id, operator: e.target.value as LogicalOperator })
          }
          disabled={disabled}
        >
          <option value="and">ALL</option>
          <option value="or">ANY</option>
        </select>
        {level > 0 && (
          <button onClick={() => dispatch({ type: 'REMOVE_GROUP', id: filter.id })} disabled={disabled}>
            Remove Group
          </button>
        )}
      </div>

      {children.map((child) =>
        child.type === 'condition' ? (
          <FilterCondition key={child.id} condition={child} schema={schema} dispatch={dispatch} disabled={disabled} />
        ) : (
          <FilterGroup key={child.id} filter={child} schema={schema} dispatch={dispatch} disabled={disabled} level={level + 1} />
        )
      )}

      <div>
        <button onClick={() => dispatch({ type: 'ADD_CONDITION', groupId: filter.id, condition: { id: '', type: 'condition' } })} disabled={disabled}>
          + Condition
        </button>
        <button onClick={() => dispatch({ type: 'ADD_GROUP', parentId: filter.id, group: { id: '', type: 'group' } })} disabled={disabled}>
          + Group
        </button>
      </div>
    </div>
  );
};

export default FilterGroup;
