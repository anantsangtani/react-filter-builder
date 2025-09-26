// src/components/FilterBuilder/FilterBuilder.tsx

import React, { useEffect } from 'react';
import { FilterBuilderProps } from '@/types/component';
import { useFilterState } from '@/hooks/useFilterState';
import FilterGroup from '@/components/FilterGroup';
import { serializeFilter, deserializeFilter } from '@/utils/serialization';
import styles from './FilterBuilder.module.css';
import { generateQueryString, generateRequestBody } from '@/utils/api';

const FilterBuilder: React.FC<FilterBuilderProps> = ({
  schema,
  initialFilter,
  apiConfig,
  onChange,
  disabled = false,
  validation,
}) => {
  // Convert JSON to state if provided
  const hasInitial = initialFilter && Object.keys(initialFilter).length > 0;
  const initialState = hasInitial ? deserializeFilter(initialFilter!) : undefined;
  const [filterState, dispatch] = useFilterState(initialState);

  // Emit changes
  useEffect(() => {
    const serialized = serializeFilter(filterState);
   const result = apiConfig?.mode === 'GET'
     ? generateQueryString(serialized)
     : generateRequestBody(serialized);

   onChange?.(serialized, result as string);
   apiConfig?.onFilterChange(serialized, result as string)
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