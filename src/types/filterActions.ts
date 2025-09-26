import { LogicalOperator, FilterState } from './filter';

export type FilterAction =
  | { type: 'ADD_CONDITION'; groupId: string; condition: FilterState }
  | { type: 'UPDATE_CONDITION'; id: string; updates: Partial<FilterState> }
  | { type: 'REMOVE_CONDITION'; id: string }
  | { type: 'ADD_GROUP'; parentId: string; group: FilterState }
  | { type: 'UPDATE_GROUP'; id: string; operator: LogicalOperator }
  | { type: 'REMOVE_GROUP'; id: string }
  | { type: 'LOAD_FROM_JSON'; filter: any }
  | { type: 'RESET' };
