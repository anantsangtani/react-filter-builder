import { useState } from 'react';
import { FilterBuilder } from 'react-filter-builder';
import { usersSchema } from './schemas/users';
import { productsSchema, productFilterExamples } from './schemas/products';
import './index.css';

type SchemaType = 'users' | 'products';

interface FilterExample {
  [key: string]: any;
}

interface ExampleCollection {
  [key: string]: FilterExample;
}

function App() {
  const [selectedSchema, setSelectedSchema] = useState<SchemaType>('users');
  const [selectedExample, setSelectedExample] = useState<string>('');

  // Get current schema
  const currentSchema = selectedSchema === 'users' ? usersSchema : productsSchema;
  
  // Get examples for current schema with proper typing
  const getExamples = (): ExampleCollection => {
    if (selectedSchema === 'users') {
      return {
        basic: { and: [{ field: 'age', operator: 'gt', value: 18 }] },
        complex: {
          and: [
            { field: 'isActive', operator: 'eq', value: true },
            {
              or: [
                { field: 'age', operator: 'between', value: [25, 65] },
                { field: 'name', operator: 'contains', value: 'admin' }
              ]
            }
          ]
        }
      };
    }
    return productFilterExamples;
  };

  const examples = getExamples();
  
  // Fix the TypeScript error with proper type checking
  const initialFilter = selectedExample && selectedExample in examples 
    ? examples[selectedExample] 
    : undefined;

  const handleFilterChange = (filter: any, qs?: string) => {
    console.log('Filter JSON:', JSON.stringify(filter, null, 2));
    console.log('Query String:', qs);
  };

  const handleSchemaChange = (newSchema: SchemaType) => {
    setSelectedSchema(newSchema);
    setSelectedExample(''); // Reset example when changing schema
  };

  const clearFilter = () => {
    setSelectedExample('');
    // This will trigger a re-render with no initial filter
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <h1 className="logo-text">🔍 Advanced Filter Builder</h1>
            </div>
            <p className="header-subtitle">
              Build complex queries with an intuitive visual interface
            </p>
          </div>
          
          {/* <div className="header-actions">
            <button 
              className="clear-btn"
              onClick={clearFilter}
              title="Clear all filters"
            >
              Clear
            </button>
          </div> */}
        </div>
      </header>

      {/* Control Bar */}
      <div className="control-bar">
        <div className="control-group">
          <label className="control-label">
            Dataset
          </label>
          <div className="select-wrapper">
            <select
              className="control-select"
              value={selectedSchema}
              onChange={(e) => handleSchemaChange(e.target.value as SchemaType)}
            >
              <option value="users">Users Dataset</option>
              <option value="products">Products Dataset</option>
            </select>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">
            Quick Start
          </label>
          <div className="select-wrapper">
            <select
              className="control-select"
              value={selectedExample}
              onChange={(e) => setSelectedExample(e.target.value)}
            >
              <option value="">Start Fresh</option>
              {Object.keys(examples).map((key) => (
                <option key={key} value={key}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dataset-info">
          <span className="field-count">
            {Object.keys(currentSchema.fields).length} fields available
          </span>
        </div>
      </div>

      {/* Main Filter Interface */}
      <div className="filter-main">
        <div className="filter-container">
          <FilterBuilder
            key={`${selectedSchema}-${selectedExample}`}
            schema={currentSchema}
            initialFilter={initialFilter}
            onChange={handleFilterChange}
            apiConfig={{ 
              mode: 'GET', 
              onFilterChange: handleFilterChange 
            }}
          />
        </div>
      </div>

      
    </div>
  );
}

export default App;