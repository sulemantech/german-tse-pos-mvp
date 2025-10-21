import React, { useState, useMemo } from 'react';
import type { Table } from '../types';

interface TablesPanelProps {
  tables: Table[];
  currentTable: Table | null;
  onSelectTable: (table: Table) => void;
  getOrderDuration: (startTime: string) => string;
  onFreeTable: (tableId: string) => void;
  onStartNewOrder: (tableId: string, guests: number) => void;
}

const TablesPanel: React.FC<TablesPanelProps> = ({
  tables,
  currentTable,
  onSelectTable,
  getOrderDuration,
  onFreeTable,
  onStartNewOrder
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'occupied' | 'free' | 'cleaning'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrderGuests, setNewOrderGuests] = useState<{ [key: string]: number }>({});

  // Filter and search tables
  const filteredTables = useMemo(() => {
    let filtered = tables;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(table => table.status === filterStatus);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(table =>
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.waiter?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [tables, filterStatus, searchTerm]);

  // Group tables by location
  const tablesByLocation = useMemo(() => {
    return filteredTables.reduce((acc, table) => {
      if (!acc[table.location]) {
        acc[table.location] = [];
      }
      acc[table.location].push(table);
      return acc;
    }, {} as Record<string, Table[]>);
  }, [filteredTables]);

  // Table statistics
  const tableStats = useMemo(() => {
    const total = tables.length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const free = tables.filter(t => t.status === 'free').length;
    const cleaning = tables.filter(t => t.status === 'cleaning').length;
    
    return { total, occupied, free, cleaning };
  }, [tables]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-500';
      case 'free': return 'bg-blue-500';
      case 'cleaning': return 'bg-amber-500';
      case 'reserved': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'occupied': return 'OCCUPIED';
      case 'free': return 'AVAILABLE';
      case 'cleaning': return 'CLEANING';
      case 'reserved': return 'RESERVED';
      default: return status.toUpperCase();
    }
  };

  const getCurrentOrder = (table: Table) => {
    if (!table.currentOrderId) return null;
    return table.orderHistory.find(order => order.id === table.currentOrderId);
  };

  const handleStartNewOrder = (tableId: string) => {
    const guests = newOrderGuests[tableId] || 1;
    onStartNewOrder(tableId, guests);
    setNewOrderGuests(prev => ({ ...prev, [tableId]: 1 }));
  };

  const QuickActions = ({ table }: { table: Table }) => {
    const currentOrder = getCurrentOrder(table);

    if (table.status === 'free') {
      return (
        <div className="flex gap-1 mt-1">
          <select
            value={newOrderGuests[table.id] || 1}
            onChange={(e) => setNewOrderGuests(prev => ({
              ...prev,
              [table.id]: Number(e.target.value)
            }))}
            className="text-xs bg-gray-700 border border-gray-600 rounded px-1 text-white w-12"
            onClick={(e) => e.stopPropagation()}
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartNewOrder(table.id);
            }}
            className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors flex-1"
          >
            Start
          </button>
        </div>
      );
    }

    if (table.status === 'cleaning') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFreeTable(table.id);
          }}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors w-full mt-1"
        >
          Mark Ready
        </button>
      );
    }

    if (table.status === 'occupied' && currentOrder) {
      return (
        <div className="text-xs text-green-400 font-medium mt-1">
          {getOrderDuration(currentOrder.startTime)} • €{currentOrder.total.toFixed(2)}
        </div>
      );
    }

    return null;
  };

  const TableCard = ({ table }: { table: Table }) => {
    const currentOrder = getCurrentOrder(table);
    
    return (
      <div
        className={`relative bg-gradient-to-br from-gray-800/50 to-transparent border rounded-lg p-2 cursor-pointer transition-all duration-200 group ${
          currentTable?.id === table.id
            ? 'border-primary shadow-glow-primary scale-[1.02]'
            : 'border-gray-600 hover:border-primary hover:shadow-glow'
        }`}
        onClick={() => onSelectTable(table)}
      >
        {/* Status Indicator */}
        <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${getStatusColor(table.status)}`}></div>
        
        {/* Table Info */}
        <div className="mb-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-white font-semibold text-sm leading-tight">{table.name}</div>
              <div className="text-gray-400 text-xs">{table.location}</div>
            </div>
            {table.guests > 0 && (
              <div className="text-accent text-xs font-medium bg-amber-500/20 px-1.5 py-0.5 rounded">
                👥{table.guests}
              </div>
            )}
          </div>
          
          {/* Status & Waiter */}
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              table.status === 'occupied' ? 'bg-green-500/20 text-green-400' :
              table.status === 'free' ? 'bg-blue-500/20 text-blue-400' :
              table.status === 'cleaning' ? 'bg-amber-500/20 text-amber-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {getStatusText(table.status)}
            </span>
            {table.waiter && (
              <span className="text-blue-400 text-xs truncate max-w-[60px]" title={table.waiter}>
                👤 {table.waiter.split(' ')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions table={table} />
      </div>
    );
  };

  const TableListItem = ({ table }: { table: Table }) => {
    const currentOrder = getCurrentOrder(table);
    
    return (
      <div
        className={`flex items-center gap-3 p-2 border-b border-gray-700/50 cursor-pointer transition-all duration-150 group ${
          currentTable?.id === table.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-700/30'
        }`}
        onClick={() => onSelectTable(table)}
      >
        {/* Status Dot */}
        <div className={`w-2 h-2 rounded-full ${getStatusColor(table.status)}`}></div>
        
        {/* Table Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-white font-semibold text-sm">{table.name}</div>
            <div className="text-gray-400 text-xs">{table.location}</div>
            {table.guests > 0 && (
              <div className="text-accent text-xs">👥{table.guests}</div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              table.status === 'occupied' ? 'bg-green-500/20 text-green-400' :
              table.status === 'free' ? 'bg-blue-500/20 text-blue-400' :
              'bg-amber-500/20 text-amber-400'
            }`}>
              {getStatusText(table.status)}
            </span>
            {table.waiter && (
              <span className="text-blue-400 text-xs">👤 {table.waiter}</span>
            )}
            {currentOrder && (
              <span className="text-green-400 text-xs">
                {getOrderDuration(currentOrder.startTime)} • €{currentOrder.total.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {table.status === 'free' && (
            <>
              <select
                value={newOrderGuests[table.id] || 1}
                onChange={(e) => setNewOrderGuests(prev => ({
                  ...prev,
                  [table.id]: Number(e.target.value)
                }))}
                className="text-xs bg-gray-700 border border-gray-600 rounded px-1 text-white w-12"
              >
                {[1,2,3,4,5,6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <button
                onClick={() => handleStartNewOrder(table.id)}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
              >
                Start
              </button>
            </>
          )}
          {table.status === 'cleaning' && (
            <button
              onClick={() => onFreeTable(table.id)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
            >
              Ready
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="bg-card backdrop-blur-xl border-r border-glass p-3 flex flex-col gap-3 h-[calc(100vh-70px)] overflow-hidden">
      {/* Header with Controls */}
      <div className="flex flex-col gap-2">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900/30 border border-glass rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:shadow-glow"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex gap-2">
          {/* View Toggle */}
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white shadow-glow-primary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-primary text-white shadow-glow-primary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1 bg-gray-800/50 border border-glass rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">All Tables</option>
            <option value="occupied">Occupied</option>
            <option value="free">Available</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-4 gap-1 text-xs">
        <div className="bg-gray-800/50 rounded p-1 text-center">
          <div className="text-white font-semibold">{tableStats.total}</div>
          <div className="text-gray-400">Total</div>
        </div>
        <div className="bg-green-500/20 rounded p-1 text-center border border-green-500/30">
          <div className="text-green-400 font-semibold">{tableStats.occupied}</div>
          <div className="text-green-400">Occupied</div>
        </div>
        <div className="bg-blue-500/20 rounded p-1 text-center border border-blue-500/30">
          <div className="text-blue-400 font-semibold">{tableStats.free}</div>
          <div className="text-blue-400">Available</div>
        </div>
        <div className="bg-amber-500/20 rounded p-1 text-center border border-amber-500/30">
          <div className="text-amber-400 font-semibold">{tableStats.cleaning}</div>
          <div className="text-amber-400">Cleaning</div>
        </div>
      </div>

      {/* Tables Container */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(tablesByLocation).length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            No tables found{searchTerm ? ` for "${searchTerm}"` : ''}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="space-y-4">
            {Object.entries(tablesByLocation).map(([location, locationTables]) => (
              <div key={location}>
                <h3 className="text-white font-semibold text-sm mb-2 px-1 sticky top-0 bg-dark/80 backdrop-blur-sm py-1">
                  {location.toUpperCase()} ({locationTables.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {locationTables.map((table) => (
                    <TableCard key={table.id} table={table} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-2">
            {Object.entries(tablesByLocation).map(([location, locationTables]) => (
              <div key={location}>
                <h3 className="text-white font-semibold text-sm mb-2 px-1 sticky top-0 bg-dark/80 backdrop-blur-sm py-1">
                  {location.toUpperCase()} ({locationTables.length})
                </h3>
                <div className="space-y-1">
                  {locationTables.map((table) => (
                    <TableListItem key={table.id} table={table} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="border-t border-glass pt-2">
        <div className="text-xs text-gray-400 text-center">
          {filteredTables.length} of {tables.length} tables
        </div>
      </div>
    </aside>
  );
};

export default TablesPanel;