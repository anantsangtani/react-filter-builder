// src/components/ValueInput/ValueInput.tsx

import React from 'react';
import { FieldConfig } from '@/types/schema';
import styles from './ValueInput.module.css';

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
      <div className={`${styles.inputGroup} ${styles.betweenInputs}`}>
        <input
          className={styles.input}
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          placeholder="Min"
          value={min}
          disabled={disabled}
          onChange={(e) => onChange(undefined, [e.target.value, max])}
        />
        <input
          className={styles.input}
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          placeholder="Max"
          value={max}
          disabled={disabled}
          onChange={(e) => onChange(undefined, [min, e.target.value])}
        />
      </div>
    );
  }

  if (type === 'boolean') {
    return (
      <select
        className={styles.select}
        value={String(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === 'true')}
      >
        <option value="">Select Value</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  if (type === 'date') {
    return (
      <input
        className={styles.input}
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
        className={styles.select}
        value={value || ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Option</option>
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
      className={styles.input}
      type={type === 'number' ? 'number' : 'text'}
      value={value || ''}
      disabled={disabled}
      placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
      onChange={(e) => onChange(type === 'number' ? +e.target.value : e.target.value)}
    />
  );
};

export default ValueInput;