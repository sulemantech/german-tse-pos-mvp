import type { Table, MenuItem } from '../types';

// Current time for realistic timestamps
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

export const tables: Table[] = [
  { 
    id: 'TABLE_01', 
    name: 'Table 1 - Window', 
    status: 'occupied', 
    guests: 2, 
    location: 'Main Dining',
    waiter: 'Anna Schmidt',
    currentOrderId: 'ORDER_001',
    orderHistory: [
      {
        id: 'ORDER_001',
        items: [
          { id: 'DRINK_WATER', name: 'Mineral Water 0.5L', quantity: 2, price: 3.50, vat: 7, notes: 'No gas' },
          { id: 'DRINK_BEER_05', name: 'Pilsner 0.5L', quantity: 2, price: 4.80, vat: 7 },
          { id: 'MAIN_SCHNITZEL', name: 'Wiener Schnitzel', quantity: 1, price: 18.90, vat: 19, notes: 'With lemon' }
        ],
        startTime: oneHourAgo.toISOString(),
        status: 'active',
        total: 45.60,
        tableId: 'TABLE_01',
        waiter: 'Anna Schmidt'
      },
      {
        id: 'ORDER_PREV_001',
        items: [
          { id: 'MAIN_BURGER_CLASSIC', name: 'Classic Beef Burger', quantity: 2, price: 16.50, vat: 19 },
          { id: 'DESSERT_CAKE', name: 'Cake of the Day', quantity: 2, price: 4.80, vat: 19 }
        ],
        startTime: twoHoursAgo.toISOString(),
        endTime: new Date(twoHoursAgo.getTime() + 45 * 60 * 1000).toISOString(),
        status: 'completed',
        total: 42.60,
        tableId: 'TABLE_01',
        waiter: 'Anna Schmidt',
        paymentMethod: 'card',
        tseSignature: 'TSE_123456789'
      }
    ]
  },
  { 
    id: 'TABLE_02', 
    name: 'Table 2 - Center', 
    status: 'occupied', 
    guests: 4, 
    location: 'Main Dining',
    waiter: 'Thomas Müller',
    currentOrderId: 'ORDER_002',
    orderHistory: [
      {
        id: 'ORDER_002',
        items: [
          { id: 'DESSERT_CAKE', name: 'Cake of the Day', quantity: 1, price: 4.80, vat: 19 }
        ],
        startTime: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        status: 'active',
        total: 4.80,
        tableId: 'TABLE_02',
        waiter: 'Thomas Müller'
      }
    ]
  },
  { 
    id: 'TABLE_03', 
    name: 'Table 3 - Corner', 
    status: 'free', 
    guests: 0,
    location: 'Main Dining',
    orderHistory: []
  },
  { 
    id: 'TABLE_11', 
    name: 'Terrace 1', 
    status: 'occupied', 
    guests: 3, 
    location: 'Terrace',
    waiter: 'Sarah Weber',
    currentOrderId: 'ORDER_003',
    orderHistory: [
      {
        id: 'ORDER_003',
        items: [
          { id: 'DRINK_WHISKY', name: 'Whisky 2cl', quantity: 2, price: 6.50, vat: 7 },
          { id: 'DRINK_BEER_03', name: 'Pilsner 0.3L', quantity: 1, price: 3.80, vat: 7 },
          { id: 'APP_SALAD', name: 'Mixed Salad', quantity: 1, price: 8.50, vat: 19 }
        ],
        startTime: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
        status: 'active',
        total: 25.30,
        tableId: 'TABLE_11',
        waiter: 'Sarah Weber'
      }
    ]
  },
  { 
    id: 'TABLE_04', 
    name: 'Table 4 - Window', 
    status: 'cleaning', 
    guests: 0,
    location: 'Main Dining',
    orderHistory: [
      {
        id: 'ORDER_COMPLETED_001',
        items: [
          { id: 'MAIN_PIZZA_MARGHERITA', name: 'Pizza Margherita', quantity: 2, price: 12.90, vat: 19 },
          { id: 'DRINK_WINE_RED', name: 'Red Wine Glass', quantity: 1, price: 7.50, vat: 7 }
        ],
        startTime: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        status: 'completed',
        total: 33.30,
        tableId: 'TABLE_04',
        waiter: 'Anna Schmidt',
        paymentMethod: 'cash',
        tseSignature: 'TSE_987654321'
      }
    ]
  }
];

export const menuItems: MenuItem[] = [
  // ===== DRINKS =====
  { id: 'DRINK_WATER', name: 'Mineral Water 0.5L', category: 'Drinks', price: 3.50, vat: 7, icon: '🥤', tags: [] },
  { id: 'DRINK_WATER_1L', name: 'Mineral Water 1.0L', category: 'Drinks', price: 5.50, vat: 7, icon: '💧', tags: [] },
  { id: 'DRINK_BEER_05', name: 'Pilsner 0.5L', category: 'Drinks', price: 4.80, vat: 7, icon: '🍺', tags: ['popular'] },
  { id: 'DRINK_BEER_03', name: 'Pilsner 0.3L', category: 'Drinks', price: 3.80, vat: 7, icon: '🍻', tags: [] },
  { id: 'DRINK_WHISKY', name: 'Whisky 2cl', category: 'Drinks', price: 6.50, vat: 7, icon: '🥃', tags: [] },
  { id: 'DRINK_COFFEE', name: 'Coffee', category: 'Drinks', price: 3.00, vat: 7, icon: '☕', tags: ['quick'] },
  { id: 'DRINK_WINE_RED', name: 'Red Wine Glass', category: 'Drinks', price: 7.50, vat: 7, icon: '🍷', tags: ['popular'] },
  { id: 'DRINK_WINE_WHITE', name: 'White Wine Glass', category: 'Drinks', price: 6.80, vat: 7, icon: '🥂', tags: [] },
  { id: 'DRINK_COCKTAIL', name: 'Signature Cocktail', category: 'Drinks', price: 12.00, vat: 7, icon: '🍸', tags: ['premium'] },

  // ===== APPETIZERS =====
  { id: 'APP_SALAD', name: 'Mixed Salad', category: 'Appetizers', price: 8.50, vat: 19, icon: '🥗', tags: ['vegetarian', 'healthy'] },
  { id: 'APP_SOUP', name: 'Soup of the Day', category: 'Appetizers', price: 6.50, vat: 19, icon: '🍲', tags: ['vegetarian', 'quick'] },
  { id: 'APP_BRUSCHETTA', name: 'Bruschetta', category: 'Appetizers', price: 7.90, vat: 19, icon: '🍞', tags: ['vegetarian'] },
  { id: 'APP_CALAMARI', name: 'Fried Calamari', category: 'Appetizers', price: 9.80, vat: 19, icon: '🦑', tags: ['popular'] },
  { id: 'APP_GARLIC_BREAD', name: 'Garlic Bread', category: 'Appetizers', price: 4.50, vat: 19, icon: '🍞', tags: ['vegetarian', 'quick'] },
  { id: 'APP_NACHOS', name: 'Loaded Nachos', category: 'Appetizers', price: 11.20, vat: 19, icon: '🌮', tags: ['shareable'] },
  { id: 'APP_SPRING_ROLLS', name: 'Spring Rolls (4pcs)', category: 'Appetizers', price: 7.50, vat: 19, icon: '🥢', tags: ['vegetarian', 'quick'] },
  { id: 'APP_CAPRESE', name: 'Caprese Salad', category: 'Appetizers', price: 8.90, vat: 19, icon: '🍅', tags: ['vegetarian', 'fresh'] },

  // ===== MAIN COURSES =====
  // BURGERS & SANDWICHES
  { id: 'MAIN_BURGER_CLASSIC', name: 'Classic Beef Burger', category: 'Main Courses', price: 16.50, vat: 19, icon: '🍔', tags: ['popular', 'quick'] },
  { id: 'MAIN_BURGER_CHEESE', name: 'Cheeseburger Deluxe', category: 'Main Courses', price: 18.90, vat: 19, icon: '🧀', tags: ['popular'] },
  { id: 'MAIN_BURGER_CHICKEN', name: 'Crispy Chicken Burger', category: 'Main Courses', price: 15.90, vat: 19, icon: '🍗', tags: ['quick'] },
  { id: 'MAIN_SANDWICH_CLUB', name: 'Club Sandwich', category: 'Main Courses', price: 14.50, vat: 19, icon: '🥪', tags: ['quick'] },

  // PIZZAS
  { id: 'MAIN_PIZZA_MARGHERITA', name: 'Pizza Margherita', category: 'Main Courses', price: 12.90, vat: 19, icon: '🍕', tags: ['vegetarian', 'quick'] },
  { id: 'MAIN_PIZZA_PEPPERONI', name: 'Pepperoni Pizza', category: 'Main Courses', price: 15.90, vat: 19, icon: '🍕', tags: ['popular'] },
  { id: 'MAIN_PIZZA_QUATTRO', name: 'Quattro Stagioni', category: 'Main Courses', price: 17.50, vat: 19, icon: '🍕', tags: [] },
  { id: 'MAIN_PIZZA_HAWAIIAN', name: 'Hawaiian Pizza', category: 'Main Courses', price: 16.20, vat: 19, icon: '🍍', tags: [] },

  // PASTA & RISOTTO
  { id: 'MAIN_PASTA_CARBONARA', name: 'Spaghetti Carbonara', category: 'Main Courses', price: 14.80, vat: 19, icon: '🍝', tags: ['popular'] },
  { id: 'MAIN_PASTA_BOLOGNESE', name: 'Spaghetti Bolognese', category: 'Main Courses', price: 15.50, vat: 19, icon: '🍝', tags: ['popular'] },
  { id: 'MAIN_PASTA_PESTO', name: 'Penne al Pesto', category: 'Main Courses', price: 13.90, vat: 19, icon: '🍝', tags: ['vegetarian', 'quick'] },
  { id: 'MAIN_RISOTTO_MUSHROOM', name: 'Mushroom Risotto', category: 'Main Courses', price: 16.80, vat: 19, icon: '🍚', tags: ['vegetarian'] },

  // MEAT & POULTRY
  { id: 'MAIN_SCHNITZEL', name: 'Wiener Schnitzel', category: 'Main Courses', price: 18.90, vat: 19, icon: '🍖', tags: ['signature'] },
  { id: 'MAIN_STEAK_RIBEYE', name: 'Ribeye Steak (300g)', category: 'Main Courses', price: 24.90, vat: 19, icon: '🥩', tags: ['premium'] },
  { id: 'MAIN_STEAK_SIRLOIN', name: 'Sirloin Steak (250g)', category: 'Main Courses', price: 22.50, vat: 19, icon: '🥩', tags: ['premium'] },
  { id: 'MAIN_CHICKEN_GRILL', name: 'Grilled Chicken Breast', category: 'Main Courses', price: 16.90, vat: 19, icon: '🍗', tags: ['healthy'] },
  { id: 'MAIN_LAMB_CHOPS', name: 'Lamb Chops (4pcs)', category: 'Main Courses', price: 26.50, vat: 19, icon: '🥩', tags: ['premium'] },

  // SEAFOOD
  { id: 'MAIN_SALMON_GRILL', name: 'Grilled Salmon', category: 'Main Courses', price: 19.50, vat: 19, icon: '🐟', tags: ['healthy'] },
  { id: 'MAIN_SALMON_TERIYAKI', name: 'Salmon Teriyaki', category: 'Main Courses', price: 20.90, vat: 19, icon: '🐟', tags: [] },
  { id: 'MAIN_SHRIMP_SCAMPI', name: 'Shrimp Scampi', category: 'Main Courses', price: 21.50, vat: 19, icon: '🦐', tags: [] },
  { id: 'MAIN_FISH_CHIPS', name: 'Fish & Chips', category: 'Main Courses', price: 15.90, vat: 19, icon: '🐟', tags: ['popular', 'quick'] },

  // VEGETARIAN & SPECIALTIES
  { id: 'MAIN_VEGGIE_STIRFRY', name: 'Vegetable Stir Fry', category: 'Main Courses', price: 13.90, vat: 19, icon: '🥬', tags: ['vegetarian', 'healthy', 'quick'] },
  { id: 'MAIN_VEGGIE_CURRY', name: 'Vegetable Curry', category: 'Main Courses', price: 14.50, vat: 19, icon: '🍛', tags: ['vegetarian'] },
  { id: 'MAIN_MUSHROOM_STEAK', name: 'Portobello Mushroom Steak', category: 'Main Courses', price: 16.90, vat: 19, icon: '🍄', tags: ['vegetarian'] },

  // ===== DESSERTS =====
  { id: 'DESSERT_ICE', name: 'Ice Cream Sundae', category: 'Desserts', price: 6.50, vat: 19, icon: '🍨', tags: ['popular'] },
  { id: 'DESSERT_CAKE', name: 'Cake of the Day', category: 'Desserts', price: 4.80, vat: 19, icon: '🍰', tags: ['quick'] },
  { id: 'DESSERT_CREME', name: 'Crème Brûlée', category: 'Desserts', price: 7.20, vat: 19, icon: '🍮', tags: [] },
  { id: 'DESSERT_TIRAMISU', name: 'Tiramisu', category: 'Desserts', price: 6.90, vat: 19, icon: '☕', tags: ['popular'] },
  { id: 'DESSERT_CHEESECAKE', name: 'New York Cheesecake', category: 'Desserts', price: 5.50, vat: 19, icon: '🧀', tags: [] },
  { id: 'DESSERT_CHOCOLATE', name: 'Chocolate Lava Cake', category: 'Desserts', price: 7.50, vat: 19, icon: '🍫', tags: ['popular'] },
  { id: 'DESSERT_APPLE', name: 'Apple Strudel', category: 'Desserts', price: 5.20, vat: 19, icon: '🥧', tags: [] },
  { id: 'DESSERT_FRUIT', name: 'Fresh Fruit Platter', category: 'Desserts', price: 8.00, vat: 19, icon: '🍓', tags: ['healthy', 'fresh'] }
];