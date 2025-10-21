import React, { useState, useMemo } from 'react';
import type { Table } from '../types';

interface TablesPanelProps {
  tables: Table[];
  currentTable: Table | null;
  onSelectTable: (table: Table) => void;
  getOrderDuration: (startTime: string) => string;
  onFreeTable: (tableId: string) => void;
  onStartNewOrder: (tableId: string, guests: number) => void;
  onCreateTable?: (tableData: Partial<Table>) => void;
}

const TablesPanel: React.FC<TablesPanelProps> = ({
  tables,
  currentTable,
  onSelectTable,
  getOrderDuration,
  onFreeTable,
  onStartNewOrder,
  onCreateTable
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'occupied' | 'free' | 'cleaning'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showTableModal, setShowTableModal] = useState<Table | null>(null);

  // Get unique locations for filter
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(tables.map(table => table.location))];
    return ['all', ...uniqueLocations];
  }, [tables]);

  // Filter and search tables
  const filteredTables = useMemo(() => {
    let filtered = tables;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(table => table.status === filterStatus);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(table => table.location === selectedLocation);
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
  }, [tables, filterStatus, selectedLocation, searchTerm]);

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

  const getCurrentOrder = (table: Table) => {
    if (!table.currentOrderId) return null;
    return table.orderHistory.find(order => order.id === table.currentOrderId);
  };

  const CompactTableCard = ({ table }: { table: Table }) => {
    const currentOrder = getCurrentOrder(table);
    
    return (
      <div
        className={`p-2 border rounded-lg cursor-pointer transition-all duration-150 group ${
          currentTable?.id === table.id
            ? 'border-primary bg-primary/10 shadow-sm'
            : 'border-gray-600 hover:border-primary hover:bg-gray-700/30'
        }`}
        onClick={() => onSelectTable(table)}
      >
        {/* Header - Table Number & Status */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              table.status === 'occupied' ? 'bg-green-500' :
              table.status === 'free' ? 'bg-blue-500' :
              'bg-amber-500'
            }`} />
            <span className="text-white font-semibold text-sm">{table.name}</span>
          </div>
          {table.guests > 0 && (
            <span className="text-amber-400 text-xs bg-amber-500/20 px-1.5 py-0.5 rounded">
              {table.guests}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1 text-xs">
          <div className="text-gray-400 flex justify-between">
            <span>{table.location}</span>
            {table.waiter && (
              <span className="text-blue-400 truncate max-w-[80px]" title={table.waiter}>
                {table.waiter.split(' ')[0]}
              </span>
            )}
          </div>

          {currentOrder && (
            <div className="flex justify-between text-green-400">
              <span>{getOrderDuration(currentOrder.startTime)}</span>
              <span>€{currentOrder.total.toFixed(2)}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
            {table.status === 'free' && (
              <button
                onClick={() => onStartNewOrder(table.id, 1)}
                className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
              >
                Start
              </button>
            )}
            {table.status === 'cleaning' && (
              <button
                onClick={() => onFreeTable(table.id)}
                className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
              >
                Ready
              </button>
            )}
            {table.status === 'occupied' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTableModal(table);
                }}
                className="flex-1 text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
              >
                Details
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TableModal = ({ table }: { table: Table }) => {
    const currentOrder = getCurrentOrder(table);
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-4 max-w-sm w-full border border-gray-600">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg font-bold text-white">{table.name}</h2>
              <p className="text-gray-400 text-sm">{table.location}</p>
            </div>
            <button
              onClick={() => setShowTableModal(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={`
                ${table.status === 'occupied' ? 'text-green-400' :
                  table.status === 'free' ? 'text-blue-400' :
                  'text-amber-400'} font-semibold`
              }>
                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
              </span>
            </div>

            {table.guests > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Guests</span>
                <span className="text-white">{table.guests}</span>
              </div>
            )}

            {table.waiter && (
              <div className="flex justify-between">
                <span className="text-gray-400">Waiter</span>
                <span className="text-blue-400">{table.waiter}</span>
              </div>
            )}

            {currentOrder && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-green-400">{getOrderDuration(currentOrder.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-accent font-semibold">€{currentOrder.total.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 pt-3 mt-3 border-t border-gray-700">
            <button
              onClick={() => {
                onSelectTable(table);
                setShowTableModal(null);
              }}
              className="flex-1 px-3 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm transition-colors"
            >
              Open Order
            </button>
            {table.status === 'occupied' && (
              <button
                onClick={() => {
                  onFreeTable(table.id);
                  setShowTableModal(null);
                }}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                Free Table
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="bg-gray-900/80 backdrop-blur-xl border-r border-gray-700 p-3 flex flex-col gap-3 h-[calc(100vh-70px)] overflow-hidden w-64">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-sm">Tables</h2>
        <div className="text-gray-400 text-xs">
          {filteredTables.length}/{tables.length}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="🔍 Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary"
        />
        
        <div className="flex gap-2">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-primary"
          >
            {locations.map(location => (
              <option key={location} value={location}>
                {location === 'all' ? 'All Areas' : location}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">All</option>
            <option value="occupied">Occupied</option>
            <option value="free">Free</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-1 text-xs">
        <div className="bg-gray-800/50 rounded p-1 text-center">
          <div className="text-white font-semibold">{tables.length}</div>
          <div className="text-gray-400">Total</div>
        </div>
        <div className="bg-green-500/20 rounded p-1 text-center border border-green-500/30">
          <div className="text-green-400 font-semibold">{tables.filter(t => t.status === 'occupied').length}</div>
          <div className="text-green-400">Occ</div>
        </div>
        <div className="bg-blue-500/20 rounded p-1 text-center border border-blue-500/30">
          <div className="text-blue-400 font-semibold">{tables.filter(t => t.status === 'free').length}</div>
          <div className="text-blue-400">Free</div>
        </div>
        <div className="bg-amber-500/20 rounded p-1 text-center border border-amber-500/30">
          <div className="text-amber-400 font-semibold">{tables.filter(t => t.status === 'cleaning').length}</div>
          <div className="text-amber-400">Clean</div>
        </div>
      </div>

      {/* Tables List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(tablesByLocation).length === 0 ? (
          <div className="text-center text-gray-400 py-4 text-sm">
            No tables found
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(tablesByLocation).map(([location, locationTables]) => (
              <div key={location}>
                <div className="flex items-center gap-2 mb-2 sticky top-0 bg-gray-900/80 backdrop-blur-sm py-1">
                  <h3 className="text-white font-semibold text-xs">
                    {location} • {locationTables.length}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {locationTables.map((table) => (
                    <CompactTableCard key={table.id} table={table} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table Detail Modal */}
      {showTableModal && <TableModal table={showTableModal} />}
    </aside>
  );
};

export default TablesPanel;