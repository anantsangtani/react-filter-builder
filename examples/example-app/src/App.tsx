// examples/example-app/src/App.tsx

import { FilterBuilder } from 'react-filter-builder';
import { usersSchema } from './schemas';
import './index.css';

function App() {
  const initialFilter = { and: [{ field: 'age', operator: 'gt', value: 18 }] };

  const handleFilterChange = (filter: any, qs?: string) => {
    console.log('Filter JSON:', filter);
    console.log('Query String:', qs);
  };

  return (
    <div className="app-container">
      <h1>🔍 Advanced Filter Builder</h1>
      <FilterBuilder
        schema={usersSchema}
        initialFilter={initialFilter}
        onChange={handleFilterChange}
        apiConfig={{ mode: 'GET', onFilterChange: handleFilterChange }}
      />
    </div>
  );
}

export default App;