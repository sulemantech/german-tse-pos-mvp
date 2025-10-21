export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  vat: number;
  icon: string;
  tags?: string[]; // Add optional tags
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  vat: number;
  notes?: string;
  icon?: string;
  category?: string;
  status?: 'pending' | 'preparing' | 'ready' | 'served'; // Add for kitchen
  priority?: 'low' | 'normal' | 'high'; // Add for kitchen
}

export type OrderStatus = 'active' | 'completed' | 'cancelled' | 'paid';

export interface Order {
  id: string;
  items: OrderItem[];
  startTime: string;
  endTime?: string;
  status: OrderStatus;
  total: number;
  tableId: string;
  waiter?: string;
  paymentMethod?: string;
  tseSignature?: string;
  priority?: 'low' | 'normal' | 'high'; // Add for kitchen
}

export interface Table {
  id: string;
  name: string;
  status: 'occupied' | 'free' | 'reserved' | 'cleaning';
  guests: number;
  location: string;
  waiter?: string;
  currentOrderId?: string;
  orderHistory: Order[];
}

export interface VATBreakdown {
  vat7: number;
  vat19: number;
  net7: number;
  net19: number;
}

export interface TableStats {
  totalTables: number;
  occupiedTables: number;
  freeTables: number;
  averageOrderTime: number;
  revenueToday: number;
}

export interface KitchenOrder {
  order: Order;
  table: Table;
  items: OrderItem[];
}