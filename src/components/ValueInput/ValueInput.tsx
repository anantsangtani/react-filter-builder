import React, { useState } from 'react';
import { FieldConfig } from '@/types/schema';
import { 
  VALUE_OPTIONAL_OPERATORS, 
  MULTI_VALUE_OPERATORS, 
  TWO_VALUE_OPERATORS 
} from '@/types/schema';
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
  const [inputList, setInputList] = useState<string[]>(
    values ? values.map(String) : ['', '']
  );

  // Handle operators that don't need value input
  if (VALUE_OPTIONAL_OPERATORS.includes(operator)) {
    return (
      <div className={styles.noValueContainer}>
        <span className={styles.noValueText}>No value required</span>
      </div>
    );
  }

  // Handle "between" operator (exactly 2 values)
  if (operator === 'between') {
    const [min = '', max = ''] = values || [];
    return (
      <div className={styles.betweenContainer}>
        <input
          className={styles.input}
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          placeholder="Min value"
          value={min}
          disabled={disabled}
          onChange={(e) => onChange(undefined, [e.target.value, max])}
        />
        <span className={styles.betweenSeparator}>and</span>
        <input
          className={styles.input}
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          placeholder="Max value"
          value={max}
          disabled={disabled}
          onChange={(e) => onChange(undefined, [min, e.target.value])}
        />
      </div>
    );
  }

  // Handle "in" and "not_in" operators (multiple values)
  if (operator === 'in' || operator === 'not_in') {
    const currentValues = values || [''];

    const addValue = () => {
      const newValues = [...currentValues, ''];
      onChange(undefined, newValues);
    };

    const removeValue = (index: number) => {
      if (currentValues.length > 1) {
        const newValues = currentValues.filter((_, i) => i !== index);
        onChange(undefined, newValues);
      }
    };

    const updateValue = (index: number, newValue: string) => {
      const newValues = [...currentValues];
      newValues[index] = type === 'number' ? +newValue : newValue;
      onChange(undefined, newValues);
    };

    return (
      <div className={styles.multiValueContainer}>
        {currentValues.map((val, index) => (
          <div key={index} className={styles.multiValueRow}>
            {options ? (
              <select
                className={styles.select}
                value={String(val)}
                disabled={disabled}
                onChange={(e) => updateValue(index, e.target.value)}
              >
                <option value="">Select Option</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={styles.input}
                type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
                value={String(val)}
                disabled={disabled}
                placeholder={`Value ${index + 1}`}
                onChange={(e) => updateValue(index, e.target.value)}
              />
            )}
            
            {currentValues.length > 1 && (
              <button
                type="button"
                className={styles.removeValueButton}
                onClick={() => removeValue(index)}
                disabled={disabled}
                title="Remove value"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          className={styles.addValueButton}
          onClick={addValue}
          disabled={disabled}
        >
          + Add Value
        </button>
      </div>
    );
  }

  // Handle boolean fields
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

  // Handle date fields
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

  // Handle fields with predefined options
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

  // Handle regular single-value inputs
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