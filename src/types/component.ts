/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { SchemaConfig } from './schema';
import { FilterJSON } from './filter';
import { APIConfig } from './api';

export interface FilterBuilderProps {
  schema: SchemaConfig;
  initialFilter?: FilterJSON;
  apiConfig?: APIConfig;
  onChange?: (filter: FilterJSON, queryString?: string) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  theme?: {
    primaryColor?: string;
    borderRadius?: string;
    spacing?: string;
  };
  accessibility?: {
    addConditionLabel?: string;
    addGroupLabel?: string;
    removeConditionLabel?: string;
    removeGroupLabel?: string;
  };
  validation?: {
    required?: boolean;
    showErrors?: boolean;
    customValidators?: Record<string, (value: any) => boolean>;
  };
}
