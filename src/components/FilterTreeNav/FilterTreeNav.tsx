// src/components/FilterTreeNav/FilterTreeNav.tsx
import React from 'react';
import { FilterState, LogicalOperator } from '@/types/filter';
import { SchemaConfig } from '@/types/schema';
import { FilterAction } from '@/types/filterActions';
import styles from './FilterTreeNav.module.css';

interface FilterTreeNavProps {
  rootGroup: FilterState;
  currentGroupId: string;
  onGroupSelect: (id: string) => void;
  dispatch: React.Dispatch<FilterAction>;
  schema: SchemaConfig;
  disabled?: boolean;
}

const FilterTreeNav: React.FC<FilterTreeNavProps> = ({
  rootGroup,
  currentGroupId,
  onGroupSelect,
  dispatch,
  schema,
  disabled = false,
}) => {
  const renderTreeNode = (group: FilterState, level: number = 0) => {
    const isActive = group.id === currentGroupId;
    const hasChildren = group.children?.some(child => child.type === 'group');
    const conditionCount = group.children?.filter(child => child.type === 'condition').length || 0;

    return (
      <div key={group.id} className={styles.treeNode}>
        <div 
          className={`${styles.nodeItem} ${isActive ? styles.active : ''}`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => !disabled && onGroupSelect(group.id)}
        >
          <div className={styles.nodeContent}>
            {hasChildren && (
              <span className={styles.expandIcon}>
                {level > 0 ? '📁' : '🏠'}
              </span>
            )}
            
            <span className={styles.nodeLabel}>
              {level === 0 ? 'Root Group' : `${group.operator?.toUpperCase()} Group`}
            </span>
            
            <span className={styles.conditionCount}>
              ({conditionCount} conditions)
            </span>
          </div>
          
          {level > 0 && (
            <button
              className={styles.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'REMOVE_GROUP', id: group.id });
                if (group.id === currentGroupId) {
                  onGroupSelect(rootGroup.id); // Go back to root
                }
              }}
              disabled={disabled}
              title="Remove Group"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Render child groups */}
        {group.children?.map(child => 
          child.type === 'group' ? renderTreeNode(child, level + 1) : null
        )}
      </div>
    );
  };

  return (
    <div className={styles.treeNav}>
      <div className={styles.header}>
        <h3>Filter Groups</h3>
      </div>
      <div className={styles.treeContent}>
        {renderTreeNode(rootGroup)}
      </div>
    </div>
  );
};

export default FilterTreeNav;