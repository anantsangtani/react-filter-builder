# React Filter Builder - Frontend Coding Challenge

A comprehensive, reusable Filter Builder UI library built with React and TypeScript that allows users to construct complex nested filtering conditions with an intuitive visual interface.

## 🎯 Overview

This project implements a **dataset-agnostic Filter Builder** that based on below key requirements:

- ✅ **Reusable Component Library** - Works with any data schema
- ✅ **Nested Conditions Support** - Unlimited depth AND/OR groups
- ✅ **JSON Serialization** - Converts UI state to structured JSON
- ✅ **API Integration** - Supports both GET (query string) and POST (JSON body) modes
- ✅ **TypeScript Implementation** - Full type safety throughout
- ✅ **Modern UI Design** - Clean, intuitive two-panel interface
- ✅ **Comprehensive Testing** - Unit tests with Jest and React Testing Library

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd react-filter-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build react-filter-builder Library:**
   ```bash
   npm run build
   ```

4. **Run the example application:**
   ```bash
   cd examples/example-app
   npm install
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the Filter Builder in action.

## 📱 How to Use the Application

### 1. **Dataset Selection**
- **Choose Dataset**: Use the dropdown in the control bar to switch between "Users Dataset" and "Products Dataset"
- **Load Examples**: Select from pre-built filter examples using the "Quick Start" dropdown

### 2. **Building Filters - Two-Panel Interface**

#### **Left Panel: Filter Navigation Tree** 🌳
- Shows hierarchical structure of your filter groups
- **Root Group**: Top-level container for all conditions
- **Child Groups**: Nested AND/OR groups for complex logic
- **Condition Count**: Shows number of conditions in each group
- **Remove Groups**: Click the red × button to delete groups

#### **Right Panel: Current Group Editor** ⚙️
- **Breadcrumb Navigation**: Shows your current location in the filter hierarchy
- **Group Logic**: Choose between "ALL (AND)" or "ANY (OR)" operators
- **Conditions Section**: Add and edit individual filter conditions
- **Child Groups**: Navigate to nested groups or create new ones

### 3. **Creating Conditions**

#### **Basic Condition Creation:**
1. Click **"+ Add Condition"**
2. **Select Field**: Choose from available fields (name, age, category, etc.)
3. **Choose Operator**: Pick comparison operator (equals, greater than, contains, etc.)
4. **Enter Value**: Provide the comparison value

#### **Advanced Operators:**
- **`between`**: Requires min and max values (e.g., age between 25-65)
- **`in`/`not_in`**: Multiple values (e.g., category in Electronics, Clothing)
- **`is_null`/`is_not_null`**: No value required (e.g., description is empty)

### 4. **Creating Nested Groups**
1. Click **"+ Add Group"** to create nested logic
2. **Automatic Navigation**: System switches to the new group automatically
3. **Add Conditions**: Build conditions within the nested group
4. **Navigate Back**: Use breadcrumb or tree navigation to return to parent

### 5. **Example Usage Scenarios**

#### **Simple Filter:**
```
Users who are active AND older than 18
```

#### **Complex Nested Filter:**
```
Products that are:
  ALL of the following (AND):
    - In stock = true
    - ANY of the following (OR):
      - Category = Electronics
      - Price > $500
    - Rating >= 4
```

## 🔍 Viewing Results

### **Console Output** (Press F12 to open Developer Tools)
- **Filter JSON**: Complete filter structure in target JSON format
- **Query String**: URL-encoded parameters for GET requests
- **Real-time Updates**: Output updates as you modify filters

### **Example JSON Output:**
```json
{
  "and": [
    { "field": "isActive", "operator": "eq", "value": true },
    {
      "or": [
        { "field": "category", "operator": "eq", "value": "electronics" },
        { "field": "price", "operator": "gt", "value": 500 }
      ]
    },
    { "field": "rating", "operator": "gte", "value": 4 }
  ]
}
```

## 🏗️ Architecture & Features

### **Core Components:**
- **FilterBuilder**: Main orchestrator component
- **FilterTreeNav**: Left panel navigation tree
- **FilterGroupEditor**: Right panel group editing interface
- **FilterCondition**: Individual condition management
- **ValueInput**: Type-aware input handling

### **Advanced Features:**
- **Real-time Validation**: Prevents invalid filter combinations
- **State Management**: Immutable updates with reducer pattern
- **API Integration**: Built-in GET/POST query generation
- **Type Safety**: Full TypeScript support throughout
- **Responsive Design**: Works on desktop and mobile devices

### **Supported Data Types:**
- **String**: Text fields with various text operations
- **Number**: Numeric comparisons and ranges
- **Boolean**: True/false selections
- **Date**: Date comparisons and ranges

### **Available Operators:**
| Type | Operators |
|------|-----------|
| String | equals, not equals, contains, starts with, ends with, in, not in, is empty, not empty |
| Number | equals, not equals, >, >=, <, <=, between, in, not in, is empty, not empty |
| Boolean | equals, not equals, is empty, not empty |
| Date | equals, not equals, before, after, between, is empty, not empty |

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

```

**Test Coverage Includes:**
- Component rendering and interaction
- State management (reducer functions)
- Serialization and deserialization
- API utility functions
- Validation logic

## 🎨 Customization

### **Styling:**
The application uses CSS modules with a glassmorphism design. Key files:
- `enhanced-app.css`: Main application styling
- Component-specific `.module.css` files for individual components

### **Schema Configuration:**
Easily customize for your data by defining schemas:

```typescript
const mySchema = {
  fields: {
    customField: { type: 'string', label: 'My Custom Field' },
    // ... more fields
  },
  operators: {
    string: ['eq', 'neq', 'contains'],
    // ... operator configurations
  }
};
```

## 📊 Project Structure

```
react-filter-builder/
├── src/
│   ├── components/          # React components
│   │   ├── FilterBuilder/   # Main component
│   │   ├── FilterTreeNav/   # Navigation tree
│   │   ├── FilterGroupEditor/ # Group editing
│   │   └── ...
│   ├── types/              # TypeScript definitions
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── examples/
│   └── example-app/        # Demo application
├── tests/                  # Test files
└── docs/                   # Documentation
```

## 🔗 Key Files to Review

1. **`src/components/FilterBuilder/FilterBuilder.tsx`** - Main component implementation
2. **`src/types/schema.ts`** - Type definitions and operator configurations
3. **`src/utils/serialization.ts`** - JSON conversion logic
4. **`examples/example-app/src/App.tsx`** - Usage demonstration
5. **`src/hooks/useFilterState.ts`** - State management logic

## 💼 Production Readiness

This implementation is production-ready with:
- **Error Handling**: Graceful degradation and user feedback
- **Performance**: Optimized for large filter trees
- **Maintainability**: Clean architecture and comprehensive documentation
- **Scalability**: Easily extensible for new features
- **User Experience**: Intuitive interface with professional design

---

**Built using React, TypeScript, and modern web technologies**
