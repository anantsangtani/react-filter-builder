/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterJSON } from './filter';

export type APIMode = 'GET' | 'POST';

export interface APIConfig {
  mode: APIMode;
  endpoint?: string;
  onFilterChange: (filter: FilterJSON, queryString?: string) => void;
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
  transformFilter?: (filter: FilterJSON) => any;
}
