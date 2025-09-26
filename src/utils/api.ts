// src/utils/api.ts

import { FilterState } from '@/types/filter';

/**
 * Serialize object into URL-encoded query string.
 */
function toQueryString(params: Record<string, any>): string {
  const parts: string[] = [];
  function encode(key: string, value: any) {
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach(v => encode(key, v));
    } else if (value !== undefined) {
      encode(key, value);
    }
  }
  return parts.join('&');
}

/**
 * Convert serialized filter JSON into simple flat params, e.g., field,operator,value pairs.
 */
export function generateQueryString(filterJson: Record<string, any>): string {
  // flatten nested filter JSON tree into array of conditions with full paths
  const conditions: any[] = [];
  function recurse(json: any, prefix: string[] = []) {
    if (json.and || json.or) {
      const operator = json.and ? 'and' : 'or';
      const items = json[operator];
      items.forEach((item: any) => recurse(item, prefix));
    } else {
      // leaf condition
      const { field, operator, value } = json;
      conditions.push({ field, operator, value });
    }
  }
  recurse(filterJson);

  // convert to params e.g. cond[0].field=...&cond[0].op=...
  const params: Record<string, any> = {};
  conditions.forEach((cond, idx) => {
    params[`cond[${idx}].field`] = cond.field;
    params[`cond[${idx}].op`] = cond.operator;
    params[`cond[${idx}].value`] = cond.value;
  });

  return toQueryString(params);
}

/**
 * For POST, simply return the JSON body.
 */
export function generateRequestBody(filterJson: Record<string, any>): Record<string, any> {
  return filterJson;
}
