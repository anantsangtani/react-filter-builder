// src/components/ValueInput/ValueInput.tsx

import React from 'react';
import { FieldConfig } from '@/types/schema';

interface ValueInputProps {
  fieldConfig: FieldConfig;
  operator: string;
  value?: any;
  values?: any[];
  onChange: (value: any, values?: any[]) => void;
  disabled?: boolean;
}

const ValueInput: React.FC<ValueInputProps> = ({
  fieldConfig,
  operator,
  value,
  values,
  onChange,
  disabled = false,
}) => {
  const { type, options } = fieldConfig;

  // Handle single or multiple values
  if (operator === 'between') {
    const [min = '', max = ''] = values || [];
    return (
      <>
        <input
          type={type === 'number' ? 'number' : 'text'}
          placeholder="Min"
          value={min}
          disabled={disabled}
          onChange={(e) => onChange(undefined, [e.target.value, max])}
        />
        <input
          type={type === 'number' ? 'number' : 'text'}
          placeholder="Max"
          value={max}
          disabled={disabled}
          onChange={(e) => onChange(undefined, [min, e.target.value])}
        />
      </>
    );
  }

  if (type === 'boolean') {
    return (
      <select
        value={String(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === 'true')}
      >
        <option value="">Select</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  if (type === 'date') {
    return (
      <input
        type="date"
        value={value || ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (options) {
    return (
      <select
        value={value || ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type === 'number' ? 'number' : 'text'}
      value={value || ''}
      disabled={disabled}
      onChange={(e) => onChange(type === 'number' ? +e.target.value : e.target.value)}
    />
  );
};

export default ValueInput;