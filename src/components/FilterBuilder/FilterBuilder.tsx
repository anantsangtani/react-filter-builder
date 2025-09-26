// src/components/FilterBuilder/FilterBuilder.tsx

import React, { useEffect } from 'react';
import { FilterBuilderProps } from '@/types/component';
import { useFilterState } from '@/hooks/useFilterState';
import FilterGroup from '@/components/FilterGroup';
import { serializeFilter, deserializeFilter } from '@/utils/serialization';
import styles from './FilterBuilder.module.css';

const FilterBuilder: React.FC<FilterBuilderProps> = ({
  schema,
  initialFilter,
  apiConfig,
  onChange,
  disabled = false,
  validation,
}) => {
  // Convert JSON to state if provided
  const initialState = initialFilter ? deserializeFilter(initialFilter) : undefined;
  const [filterState, dispatch] = useFilterState(initialState);

  // Emit changes
  useEffect(() => {
    const serialized = serializeFilter(filterState);
    onChange?.(serialized);
    apiConfig?.onFilterChange(serialized);
  }, [filterState, onChange, apiConfig]);

  return (
    <div className={styles.container} data-testid="filter-builder">
      <FilterGroup
        filter={filterState}
        schema={schema}
        dispatch={dispatch}
        disabled={disabled}
        level={0}
      />
    </div>
  );
};

export default FilterBuilder;