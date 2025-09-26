/* eslint-disable @typescript-eslint/no-unused-vars */
import { FilterState, FilterJSON } from '../types/filter';

export function serializeFilter(state: FilterState): FilterJSON {
  throw new Error('serializeFilter not implemented');
}

export function deserializeFilter(json: FilterJSON): FilterState {
  throw new Error('deserializeFilter not implemented');
}
