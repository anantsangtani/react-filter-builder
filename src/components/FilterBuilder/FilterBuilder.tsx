// src/components/FilterBuilder/FilterBuilder.tsx
import React, { useEffect, useState } from 'react';
import { FilterBuilderProps } from '@/types/component';
import { useFilterState } from '@/hooks/useFilterState';
import { FilterState } from '@/types/filter';
import FilterTreeNav from '@/components/FilterTreeNav';
import FilterGroupEditor from '@/components/FilterGroupEditor';
import { serializeFilter, deserializeFilter } from '@/utils/serialization';
import { generateQueryString, generateRequestBody } from '@/utils/api';
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
  const [currentGroupId, setCurrentGroupId] = useState<string>(filterState.id);

  // Update currentGroupId when filterState changes (e.g., on reset or initial load)
  useEffect(() => {
    setCurrentGroupId(filterState.id);
  }, [filterState.id]);

  // Emit changes
  useEffect(() => {
    const serialized = serializeFilter(filterState);
    const result = apiConfig?.mode === 'GET'
      ? generateQueryString(serialized)
      : generateRequestBody(serialized);
    
    onChange?.(serialized, result as string);
    apiConfig?.onFilterChange?.(serialized, result as string);
  }, [filterState, onChange, apiConfig]);

  // Find current group being edited
  const findGroupById = (state: FilterState, id: string): FilterState | null => {
    if (state.id === id) return state;
    if (state.children) {
      for (const child of state.children) {
        const found = findGroupById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentGroup = findGroupById(filterState, currentGroupId) || filterState;
  
  // Breadcrumb path to current group
  const getPathToGroup = (state: FilterState, targetId: string, path: FilterState[] = []): FilterState[] | null => {
    const currentPath = [...path, state];
    if (state.id === targetId) return currentPath;
    
    if (state.children) {
      for (const child of state.children) {
        const found = getPathToGroup(child, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  const breadcrumbPath = getPathToGroup(filterState, currentGroupId) || [filterState];

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <FilterTreeNav
          rootGroup={filterState}
          currentGroupId={currentGroupId}
          onGroupSelect={setCurrentGroupId}
          dispatch={dispatch}
          schema={schema}
          disabled={disabled}
        />
      </div>
      
      <div className={styles.rightPanel}>
        <FilterGroupEditor
          group={currentGroup}
          breadcrumbPath={breadcrumbPath}
          onGroupSelect={setCurrentGroupId}
          dispatch={dispatch}
          schema={schema}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FilterBuilder;