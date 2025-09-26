export const productsSchema = {
  fields: {
    // String fields
    name: { 
      type: 'string', 
      label: 'Product Name',
      required: true 
    },
    category: { 
      type: 'string', 
      label: 'Category',
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Books', value: 'books' },
        { label: 'Home & Garden', value: 'home-garden' },
        { label: 'Sports', value: 'sports' },
        { label: 'Toys', value: 'toys' }
      ]
    },
    brand: { 
      type: 'string', 
      label: 'Brand',
      nullable: true 
    },
    sku: { 
      type: 'string', 
      label: 'SKU' 
    },
    description: { 
      type: 'string', 
      label: 'Description',
      nullable: true 
    },
    
    // Number fields
    price: { 
      type: 'number', 
      label: 'Price ($)',
      required: true 
    },
    originalPrice: { 
      type: 'number', 
      label: 'Original Price ($)',
      nullable: true 
    },
    stock: { 
      type: 'number', 
      label: 'Stock Quantity' 
    },
    rating: { 
      type: 'number', 
      label: 'Rating (1-5)',
      nullable: true 
    },
    weight: { 
      type: 'number', 
      label: 'Weight (lbs)',
      nullable: true 
    },
    
    // Boolean fields
    inStock: { 
      type: 'boolean', 
      label: 'In Stock' 
    },
    featured: { 
      type: 'boolean', 
      label: 'Featured Product' 
    },
    onSale: { 
      type: 'boolean', 
      label: 'On Sale' 
    },
    freeShipping: { 
      type: 'boolean', 
      label: 'Free Shipping' 
    },
    
    // Date fields
    createdAt: { 
      type: 'date', 
      label: 'Created Date' 
    },
    updatedAt: { 
      type: 'date', 
      label: 'Last Updated',
      nullable: true 
    },
    saleStartDate: { 
      type: 'date', 
      label: 'Sale Start Date',
      nullable: true 
    },
    saleEndDate: { 
      type: 'date', 
      label: 'Sale End Date',
      nullable: true 
    }
  },
  operators: {
    string: ['eq', 'neq', 'contains', 'starts_with', 'ends_with', 'in', 'not_in', 'is_null', 'is_not_null'],
    number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'in', 'not_in', 'is_null', 'is_not_null'],
    boolean: ['eq', 'neq', 'is_null', 'is_not_null'],
    date: ['eq', 'neq', 'before', 'after', 'between', 'is_null', 'is_not_null']
  }
};

// Sample filter examples for products
export const productFilterExamples = {
  // Electronics under $500
  electronicsUnder500: {
    and: [
      { field: 'category', operator: 'eq', value: 'electronics' },
      { field: 'price', operator: 'lt', value: 500 }
    ]
  },
  
  // Featured products on sale
  featuredOnSale: {
    and: [
      { field: 'featured', operator: 'eq', value: true },
      { field: 'onSale', operator: 'eq', value: true }
    ]
  },
  
  // High-rated products with free shipping
  highRatedFreeShipping: {
    and: [
      { field: 'rating', operator: 'gte', value: 4 },
      { field: 'freeShipping', operator: 'eq', value: true }
    ]
  },
  
  // Complex filter: Popular categories or expensive items
  popularOrExpensive: {
    or: [
      {
        and: [
          { field: 'category', operator: 'in', value: ['electronics', 'clothing'] },
          { field: 'rating', operator: 'gte', value: 4 }
        ]
      },
      { field: 'price', operator: 'gt', value: 1000 }
    ]
  },
  
  // Price range with stock availability
  priceRangeInStock: {
    and: [
      { field: 'price', operator: 'between', value: [100, 500] },
      { field: 'inStock', operator: 'eq', value: true },
      { field: 'stock', operator: 'gt', value: 0 }
    ]
  },
  
  // Recently updated products with descriptions
  recentWithDescriptions: {
    and: [
      { field: 'updatedAt', operator: 'after', value: '2024-01-01' },
      { field: 'description', operator: 'is_not_null' }
    ]
  }
};