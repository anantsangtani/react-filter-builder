/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any */
import { DataType } from './schema';

export type LogicalOperator = 'and' | 'or';

export interface FilterState {
  id: string;
  type: 'group' | 'condition';
  operator?: LogicalOperator;
  children?: FilterState[];
  field?: string;
  conditionOperator?: string;
  value?: any;
  values?: any[];
}

export interface FilterJSON {
  [key: string]: any;
  and?: FilterConditionJSON[];
  or?: FilterConditionJSON[];
}

export interface FilterConditionJSON {
  field?: string;
  operator?: string;
  value?: any;
  and?: FilterConditionJSON[];
  or?: FilterConditionJSON[];
}
