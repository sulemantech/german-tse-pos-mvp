import { useState, useEffect } from 'react';
import type { Table, MenuItem, OrderItem, VATBreakdown, Order, TableStats } from '../types';
import { tables as initialTables, menuItems as initialMenuItems } from '../data/mockData';

export const usePOS = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [menuItems] = useState<MenuItem[]>(initialMenuItems);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Auto-select first occupied table on load
  useEffect(() => {
    const firstOccupied = tables.find(table => table.status === 'occupied');
    if (firstOccupied) {
      setCurrentTable(firstOccupied);
    }
  }, []);

  // Get current active order for a table
  const getCurrentOrder = (table: Table): Order | null => {
    if (!table.currentOrderId) return null;
    return table.orderHistory.find(order => order.id === table.currentOrderId) || null;
  };

  // Start a new order for a table
  const startNewOrder = (tableId: string, guests: number, waiter?: string) => {
    const newOrder: Order = {
      id: `ORDER_${Date.now()}`,
      items: [],
      startTime: new Date().toISOString(),
      status: 'active',
      total: 0,
      tableId,
      waiter
    };

    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          status: 'occupied',
          guests,
          currentOrderId: newOrder.id,
          orderHistory: [...table.orderHistory, newOrder],
          waiter
        };
      }
      return table;
    }));

    // Update current table if it's the one we're modifying
    if (currentTable?.id === tableId) {
      const updatedTable = tables.find(t => t.id === tableId);
      if (updatedTable) setCurrentTable(updatedTable);
    }
  };

  // Complete an order (mark as paid and ready for cleanup)
  const completeOrder = (tableId: string, paymentMethod: string, tseSignature: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId && table.currentOrderId) {
        const updatedOrders = table.orderHistory.map(order => 
          order.id === table.currentOrderId 
            ? { 
                ...order, 
                status: 'paid' as const,
                endTime: new Date().toISOString(),
                paymentMethod,
                tseSignature
              }
            : order
        );

        return {
          ...table,
          status: 'cleaning',
          currentOrderId: undefined,
          orderHistory: updatedOrders
        };
      }
      return table;
    }));

    // Clear current table if it's the one we're completing
    if (currentTable?.id === tableId) {
      setCurrentTable(null);
    }
  };

  // Free up a table after cleaning
  const freeTable = (tableId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          status: 'free',
          guests: 0,
          waiter: undefined
        };
      }
      return table;
    }));
  };

  // Add item to current order
  const addToOrder = (menuItem: MenuItem) => {
    if (!currentTable || currentTable.status !== 'occupied' || !currentTable.currentOrderId) {
      // If no active order, start one automatically
      if (currentTable && currentTable.status === 'free') {
        startNewOrder(currentTable.id, 1, 'Auto-Assigned');
      } else {
        return;
      }
    }

    const updatedTables = tables.map(table => {
      if (table.id === currentTable.id && table.currentOrderId) {
        const currentOrder = table.orderHistory.find(order => order.id === table.currentOrderId);
        if (!currentOrder) return table;

        const existingItemIndex = currentOrder.items.findIndex(item => item.id === menuItem.id);
        const updatedItems = [...currentOrder.items];

        if (existingItemIndex >= 0) {
          updatedItems[existingItemIndex].quantity += 1;
        } else {
          updatedItems.push({
            ...menuItem,
            quantity: 1,
            notes: ''
          });
        }

        const total = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const updatedOrders = table.orderHistory.map(order => 
          order.id === table.currentOrderId 
            ? { ...order, items: updatedItems, total }
            : order
        );

        return {
          ...table,
          orderHistory: updatedOrders
        };
      }
      return table;
    });

    setTables(updatedTables);
    setCurrentTable(updatedTables.find(t => t.id === currentTable.id) || null);
  };

  // Update item quantity
  const updateQuantity = (itemIndex: number, change: number) => {
    if (!currentTable || !currentTable.currentOrderId) return;

    const updatedTables = tables.map(table => {
      if (table.id === currentTable.id && table.currentOrderId) {
        const currentOrder = table.orderHistory.find(order => order.id === table.currentOrderId);
        if (!currentOrder) return table;

        const updatedItems = [...currentOrder.items];
        const item = updatedItems[itemIndex];
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
          updatedItems.splice(itemIndex, 1);
        }

        const total = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const updatedOrders = table.orderHistory.map(order => 
          order.id === table.currentOrderId 
            ? { ...order, items: updatedItems, total }
            : order
        );

        return {
          ...table,
          orderHistory: updatedOrders
        };
      }
      return table;
    });

    setTables(updatedTables);
    setCurrentTable(updatedTables.find(t => t.id === currentTable.id) || null);
  };

  // Remove item from order
  const removeItem = (itemIndex: number) => {
    if (!currentTable || !currentTable.currentOrderId) return;

    const updatedTables = tables.map(table => {
      if (table.id === currentTable.id && table.currentOrderId) {
        const currentOrder = table.orderHistory.find(order => order.id === table.currentOrderId);
        if (!currentOrder) return table;

        const updatedItems = [...currentOrder.items];
        updatedItems.splice(itemIndex, 1);
        
        const total = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const updatedOrders = table.orderHistory.map(order => 
          order.id === table.currentOrderId 
            ? { ...order, items: updatedItems, total }
            : order
        );

        return {
          ...table,
          orderHistory: updatedOrders
        };
      }
      return table;
    });

    setTables(updatedTables);
    setCurrentTable(updatedTables.find(t => t.id === currentTable.id) || null);
  };

  // Table statistics
  const getTableStats = (): TableStats => {
    const totalTables = tables.length;
    const occupiedTables = tables.filter(table => table.status === 'occupied').length;
    const freeTables = tables.filter(table => table.status === 'free').length;
    
    const completedOrders = tables.flatMap(table => 
      table.orderHistory.filter(order => order.status === 'completed' || order.status === 'paid')
    );
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    
    const averageOrderTime = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => {
          if (!order.endTime) return sum;
          const start = new Date(order.startTime).getTime();
          const end = new Date(order.endTime).getTime();
          return sum + (end - start) / (60 * 1000); // Convert to minutes
        }, 0) / completedOrders.length
      : 0;

    return {
      totalTables,
      occupiedTables,
      freeTables,
      averageOrderTime: Math.round(averageOrderTime),
      revenueToday: totalRevenue
    };
  };

  // Get order duration
  const getOrderDuration = (startTime: string): string => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 60000);
    return `${diff}m`;
  };

  // Calculate VAT breakdown
  const calculateVATBreakdown = (items: OrderItem[]): VATBreakdown => {
    const breakdown: VATBreakdown = { vat7: 0, vat19: 0, net7: 0, net19: 0 };
    
    items.forEach(item => {
      const netPrice = (item.quantity * item.price) / (1 + item.vat/100);
      const vatAmount = (item.quantity * item.price) - netPrice;
      
      if (item.vat === 7) {
        breakdown.net7 += netPrice;
        breakdown.vat7 += vatAmount;
      } else if (item.vat === 19) {
        breakdown.net19 += netPrice;
        breakdown.vat19 += vatAmount;
      }
    });
    
    return breakdown;
  };

  const filteredMenuItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const currentOrder = currentTable ? getCurrentOrder(currentTable) : null;

  return {
    tables,
    menuItems: filteredMenuItems,
    currentTable,
    currentOrder,
    selectedCategory,
    tableStats: getTableStats(),
    selectTable: setCurrentTable,
    startNewOrder,
    completeOrder,
    freeTable,
    updateQuantity,
    removeItem,
    addToOrder,
    setSelectedCategory,
    getOrderDuration,
    calculateVATBreakdown
  };
};