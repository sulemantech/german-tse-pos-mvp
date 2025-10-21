import React, { useState, useMemo } from 'react';
import type { Order, OrderItem, Table } from '../types';

interface KitchenViewProps {
  orders: Order[];
  tables: Table[];
  onUpdateItemStatus: (orderId: string, itemIndex: number, status: OrderItem['status']) => void;
  onCompleteOrder: (orderId: string) => void;
  onPriorityChange: (orderId: string, priority: 'low' | 'normal' | 'high' | 'urgent') => void;
}

interface KitchenOrder {
  order: Order;
  table: Table;
  items: OrderItem[];
}

const KitchenView: React.FC<KitchenViewProps> = ({
  orders,
  tables,
  onUpdateItemStatus,
  onCompleteOrder,
  onPriorityChange
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'served'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'normal' | 'high' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);

  // Combine orders with table data and filter items
  const kitchenOrders = useMemo(() => {
    return orders
      .filter(order => order.status === 'active')
      .map(order => {
        const table = tables.find(t => t.id === order.tableId);
        const pendingItems = order.items.filter(item => 
          item.status === 'pending' || item.status === 'preparing'
        );
        
        return {
          order,
          table,
          items: pendingItems
        };
      })
      .filter(kitchenOrder => kitchenOrder.table && kitchenOrder.items.length > 0);
  }, [orders, tables]);

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    let filtered = kitchenOrders;

    // Filter by item status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(kitchenOrder =>
        kitchenOrder.items.some(item => item.status === filterStatus)
      );
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(kitchenOrder =>
        kitchenOrder.order.priority === filterPriority
      );
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(kitchenOrder =>
        kitchenOrder.table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kitchenOrder.order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kitchenOrder.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [kitchenOrders, filterStatus, filterPriority, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const allItems = kitchenOrders.flatMap(ko => ko.items);
    return {
      total: allItems.length,
      pending: allItems.filter(item => item.status === 'pending').length,
      preparing: allItems.filter(item => item.status === 'preparing').length,
      ready: allItems.filter(item => item.status === 'ready').length,
    };
  }, [kitchenOrders]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 border-red-500 text-white';
      case 'high': return 'bg-orange-500 border-orange-500 text-white';
      case 'normal': return 'bg-blue-500 border-blue-500 text-white';
      case 'low': return 'bg-green-500 border-green-500 text-white';
      default: return 'bg-gray-500 border-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 border-amber-500 text-amber-400';
      case 'preparing': return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'ready': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'served': return 'bg-gray-500/20 border-gray-500 text-gray-400';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const getCookingTime = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 60000); // minutes
    return `${diff}m`;
  };

  const KitchenOrderCard = ({ kitchenOrder }: { kitchenOrder: KitchenOrder }) => {
    const isAllReady = kitchenOrder.items.every(item => item.status === 'ready');
    
    return (
      <div className={`bg-gray-800/50 border rounded-lg p-3 transition-all duration-200 ${
        isAllReady ? 'border-green-500 shadow-lg shadow-green-500/20' :
        kitchenOrder.order.priority === 'urgent' ? 'border-red-500 shadow-lg shadow-red-500/20' :
        kitchenOrder.order.priority === 'high' ? 'border-orange-500' :
        'border-gray-600 hover:border-gray-500'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(kitchenOrder.order.priority)}`}>
              {kitchenOrder.order.priority.toUpperCase()}
            </div>
            <div className="text-white font-bold text-sm">{kitchenOrder.table.name}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-xs">{getCookingTime(kitchenOrder.order.startTime)}</div>
            <div className="text-accent text-xs font-semibold">#{kitchenOrder.order.id.slice(-4)}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-3">
          {kitchenOrder.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded border-l-4 border-gray-500">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="text-lg">{item.icon || '🍽️'}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium text-sm truncate">{item.name}</div>
                  {item.notes && (
                    <div className="text-gray-400 text-xs truncate">📝 {item.notes}</div>
                  )}
                  <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {item.status.toUpperCase()}
                </div>
                <div className="flex flex-col gap-1">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => onUpdateItemStatus(kitchenOrder.order.id, index, 'preparing')}
                      className="w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs flex items-center justify-center"
                      title="Start Preparing"
                    >
                      ▶
                    </button>
                  )}
                  {item.status === 'preparing' && (
                    <button
                      onClick={() => onUpdateItemStatus(kitchenOrder.order.id, index, 'ready')}
                      className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white text-xs flex items-center justify-center"
                      title="Mark Ready"
                    >
                      ✓
                    </button>
                  )}
                  {item.status === 'ready' && (
                    <button
                      onClick={() => onUpdateItemStatus(kitchenOrder.order.id, index, 'served')}
                      className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs flex items-center justify-center"
                      title="Mark Served"
                    >
                      🚀
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2">
          {isAllReady ? (
            <button
              onClick={() => onCompleteOrder(kitchenOrder.order.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold transition-colors"
            >
              ORDER READY
            </button>
          ) : (
            <div className="flex gap-1 flex-1">
              <select
                value={kitchenOrder.order.priority}
                onChange={(e) => onPriorityChange(kitchenOrder.order.id, e.target.value as any)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-primary"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button
                onClick={() => setSelectedOrder(kitchenOrder)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs transition-colors"
              >
                Details
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const OrderDetailModal = ({ kitchenOrder }: { kitchenOrder: KitchenOrder }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-600 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Order Details</h2>
              <div className="text-gray-400 text-sm">
                {kitchenOrder.table.name} • {getCookingTime(kitchenOrder.order.startTime)} • {kitchenOrder.items.length} items
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-gray-400">Order ID</div>
                <div className="text-white font-mono">#{kitchenOrder.order.id.slice(-8)}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-gray-400">Priority</div>
                <div className={`font-semibold ${getPriorityColor(kitchenOrder.order.priority).replace('bg-', 'text-')}`}>
                  {kitchenOrder.order.priority.toUpperCase()}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-gray-400">Table</div>
                <div className="text-white font-semibold">{kitchenOrder.table.name}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-gray-400">Location</div>
                <div className="text-gray-300">{kitchenOrder.table.location}</div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-white font-semibold mb-3">Order Items</h3>
              <div className="space-y-2">
                {kitchenOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{item.icon || '🍽️'}</div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{item.name}</div>
                        {item.notes && (
                          <div className="text-gray-400 text-sm mt-1">Note: {item.notes}</div>
                        )}
                        <div className="text-gray-400 text-sm">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  kitchenOrder.items.forEach((item, index) => {
                    if (item.status === 'pending') {
                      onUpdateItemStatus(kitchenOrder.order.id, index, 'preparing');
                    }
                  });
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Start All Items
              </button>
              <button
                onClick={() => {
                  kitchenOrder.items.forEach((item, index) => {
                    if (item.status === 'preparing') {
                      onUpdateItemStatus(kitchenOrder.order.id, index, 'ready');
                    }
                  });
                }}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Mark All Ready
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kitchen Display</h1>
          <p className="text-gray-400">Real-time order management</p>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold">{new Date().toLocaleTimeString()}</div>
          <div className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder="🔍 Search orders, tables, or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filters */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-primary"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-600">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400">Total Items</div>
        </div>
        <div className="bg-amber-500/20 rounded-lg p-4 text-center border border-amber-500/30">
          <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
          <div className="text-amber-400">Pending</div>
        </div>
        <div className="bg-blue-500/20 rounded-lg p-4 text-center border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{stats.preparing}</div>
          <div className="text-blue-400">Preparing</div>
        </div>
        <div className="bg-green-500/20 rounded-lg p-4 text-center border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">{stats.ready}</div>
          <div className="text-green-400">Ready</div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <div className="text-gray-400 text-xl">No active orders</div>
          <div className="text-gray-500 mt-2">All caught up!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredOrders.map((kitchenOrder) => (
            <KitchenOrderCard key={kitchenOrder.order.id} kitchenOrder={kitchenOrder} />
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && <OrderDetailModal kitchenOrder={selectedOrder} />}
    </div>
  );
};

export default KitchenView;