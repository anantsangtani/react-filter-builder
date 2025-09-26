// src/components/FilterGroupEditor/FilterGroupEditor.tsx
import React from 'react';
import { FilterState, LogicalOperator } from '@/types/filter';
import { SchemaConfig } from '@/types/schema';
import { FilterAction } from '@/types/filterActions';
import FilterCondition from '@/components/FilterCondition';
import { createEmptyGroup, createEmptyCondition } from '@/utils/initState';
import styles from './FilterGroupEditor.module.css';

interface FilterGroupEditorProps {
  group: FilterState;
  breadcrumbPath: FilterState[];
  onGroupSelect: (id: string) => void;
  dispatch: React.Dispatch<FilterAction>;
  schema: SchemaConfig;
  disabled?: boolean;
}

const FilterGroupEditor: React.FC<FilterGroupEditorProps> = ({
  group,
  breadcrumbPath,
  onGroupSelect,
  dispatch,
  schema,
  disabled = false,
}) => {
  const conditions = group.children?.filter(child => child.type === 'condition') || [];
  const childGroups = group.children?.filter(child => child.type === 'group') || [];

  const handleAddCondition = () => {
    const newCondition = createEmptyCondition();
    dispatch({ 
      type: 'ADD_CONDITION', 
      groupId: group.id, 
      condition: newCondition 
    });
  };

  const handleAddGroup = () => {
    const newGroup = createEmptyGroup('and');
    dispatch({ 
      type: 'ADD_GROUP', 
      parentId: group.id, 
      group: newGroup 
    });
    // Navigate to the new group
    onGroupSelect(newGroup.id);
  };

  return (
    <div className={styles.editor}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        {breadcrumbPath.map((pathGroup, index) => (
          <React.Fragment key={pathGroup.id}>
            {index > 0 && <span className={styles.separator}>›</span>}
            <button
              className={`${styles.breadcrumbItem} ${pathGroup.id === group.id ? styles.active : ''}`}
              onClick={() => onGroupSelect(pathGroup.id)}
              disabled={disabled}
            >
              {index === 0 ? 'Root' : `${pathGroup.operator?.toUpperCase()} Group`}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Group Operator */}
      <div className={styles.groupHeader}>
        <label className={styles.operatorLabel}>Group Logic:</label>
        <select
          className={styles.operatorSelect}
          value={group.operator || 'and'}
          onChange={(e) =>
            dispatch({ 
              type: 'UPDATE_GROUP', 
              id: group.id, 
              operator: e.target.value as LogicalOperator 
            })
          }
          disabled={disabled}
        >
          <option value="and">ALL of the following (AND)</option>
          <option value="or">ANY of the following (OR)</option>
        </select>
      </div>

      {/* Conditions */}
      <div className={styles.conditionsSection}>
        <h4 className={styles.sectionTitle}>Conditions</h4>
        {conditions.length === 0 ? (
          <div className={styles.emptyState}>
            No conditions yet. Add a condition to start building your filter.
          </div>
        ) : (
          <div className={styles.conditionsList}>
            {conditions.map((condition) => (
              <div key={condition.id} className={styles.conditionWrapper}>
                <FilterCondition
                  condition={condition}
                  schema={schema}
                  dispatch={dispatch}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Child Groups */}
      {childGroups.length > 0 && (
        <div className={styles.childGroupsSection}>
          <h4 className={styles.sectionTitle}>Child Groups</h4>
          <div className={styles.childGroupsList}>
            {childGroups.map((childGroup) => {
              const conditionCount = childGroup.children?.filter(c => c.type === 'condition').length || 0;
              return (
                <div key={childGroup.id} className={styles.childGroupItem}>
                  <button
                    className={styles.childGroupButton}
                    onClick={() => onGroupSelect(childGroup.id)}
                    disabled={disabled}
                  >
                    <span className={styles.childGroupIcon}>📁</span>
                    <span className={styles.childGroupLabel}>
                      {childGroup.operator?.toUpperCase()} Group ({conditionCount} conditions)
                    </span>
                  </button>
                  
                  <button
                    className={styles.removeChildGroupButton}
                    onClick={() => dispatch({ type: 'REMOVE_GROUP', id: childGroup.id })}
                    disabled={disabled}
                    title="Remove Group"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={styles.addButton}
          onClick={handleAddCondition}
          disabled={disabled}
        >
          + Add Condition
        </button>
        
        <button
          className={styles.addButton}
          onClick={handleAddGroup}
          disabled={disabled}
        >
          + Add Group
        </button>
      </div>
    </div>
  );
};

export default FilterGroupEditor;