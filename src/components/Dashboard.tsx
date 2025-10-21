import React, { useState, useMemo } from 'react';
import type { Table, MenuItem, Order } from '../types';

interface DashboardProps {
  tables: Table[];
  menuItems: MenuItem[];
  orders: Order[];
  tableStats: {
    totalTables: number;
    occupiedTables: number;
    freeTables: number;
    averageOrderTime: number;
    revenueToday: number;
  };
}

interface EditModalData {
  type: 'menu' | 'table' | 'staff';
  data: any;
  isEditing: boolean;
}

// Extended types for dashboard-specific data
interface ExtendedMenuItem extends MenuItem {
  tags?: string[];
}

interface ExtendedTable extends Table {
  capacity?: number;
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  tables: number;
  revenue: number;
  rating: number;
  status: 'active' | 'break' | 'off';
  avatar: string;
}

const Dashboard: React.FC<DashboardProps> = ({ tables, menuItems, orders, tableStats }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'menu' | 'tables' | 'staff' | 'settings'>('overview');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [editModal, setEditModal] = useState<EditModalData | null>(null);

  // Cast menuItems to extended type
  const extendedMenuItems = menuItems as ExtendedMenuItem[];
  const extendedTables = tables as ExtendedTable[];

  // Enhanced Analytics Data
  const analyticsData = useMemo(() => {
    const hourlySales = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      sales: Math.floor(Math.random() * 1000) + 500,
      orders: Math.floor(Math.random() * 30) + 10,
      time: `${i.toString().padStart(2, '0')}:00`
    }));

    const weeklyTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      growth: (Math.random() - 0.3) * 20
    }));

    const paymentMethods = [
      { method: 'Credit Card', percentage: 65, amount: 12500 },
      { method: 'Cash', percentage: 25, amount: 4800 },
      { method: 'Mobile Pay', percentage: 8, amount: 1500 },
      { method: 'Other', percentage: 2, amount: 400 }
    ];

    return { hourlySales, weeklyTrend, paymentMethods };
  }, []);

  // Enhanced Staff Data
  const staffData = useMemo((): StaffMember[] => {
    return [
      {
        id: 1,
        name: 'Anna Schmidt',
        role: 'Head Waiter',
        tables: 4,
        revenue: 2850,
        rating: 4.8,
        status: 'active',
        avatar: '👩‍💼'
      },
      {
        id: 2,
        name: 'Thomas Müller',
        role: 'Senior Waiter',
        tables: 3,
        revenue: 2200,
        rating: 4.6,
        status: 'active',
        avatar: '👨‍💼'
      },
      {
        id: 3,
        name: 'Sarah Weber',
        role: 'Waiter',
        tables: 3,
        revenue: 1800,
        rating: 4.4,
        status: 'break',
        avatar: '👩‍🍳'
      },
      {
        id: 4,
        name: 'Michael Bauer',
        role: 'Trainee',
        tables: 2,
        revenue: 1200,
        rating: 4.2,
        status: 'active',
        avatar: '👨‍🎓'
      }
    ];
  }, []);

  // Enhanced Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">€8,240</div>
          <div className="text-blue-400 text-sm">Today's Revenue</div>
          <div className="text-green-400 text-xs mt-1">↑ 15.2% from yesterday</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">42</div>
          <div className="text-green-400 text-sm">Active Orders</div>
          <div className="text-green-400 text-xs mt-1">↑ 8 orders from last hour</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{tableStats.occupiedTables}/{tableStats.totalTables}</div>
          <div className="text-purple-400 text-sm">Tables Occupied</div>
          <div className="text-green-400 text-xs mt-1">
            {Math.round((tableStats.occupiedTables / tableStats.totalTables) * 100)}% utilization rate
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-orange-400 text-sm">Customers Today</div>
          <div className="text-green-400 text-xs mt-1">↑ 22 from this time yesterday</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold text-lg">Revenue Overview</h3>
            <div className="flex gap-2 text-sm">
              <span className="text-primary">● Today</span>
              <span className="text-gray-500">● Yesterday</span>
            </div>
          </div>
          
          <div className="h-64">
            <div className="flex items-end justify-between h-48 gap-1">
              {[
                { time: '10:00', revenue: 420, orders: 8 },
                { time: '12:00', revenue: 1250, orders: 24 },
                { time: '14:00', revenue: 980, orders: 18 },
                { time: '16:00', revenue: 620, orders: 12 },
                { time: '18:00', revenue: 2100, orders: 35 },
                { time: '20:00', revenue: 1850, orders: 28 },
                { time: '22:00', revenue: 1020, orders: 16 }
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-primary to-primary/70 rounded-t transition-all duration-300 hover:from-accent hover:to-accent/70 cursor-pointer"
                    style={{ height: `${(data.revenue / 2500) * 100}%` }}
                  >
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs whitespace-nowrap z-10">
                      <div className="text-white font-semibold">€{data.revenue}</div>
                      <div className="text-gray-400">{data.orders} orders</div>
                      <div className="text-gray-400">{data.time}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-2">{data.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {[
              { name: 'Wiener Schnitzel', sales: 42, revenue: 793, icon: '🍖' },
              { name: 'Pizza Margherita', sales: 38, revenue: 490, icon: '🍕' },
              { name: 'Pilsner 0.5L', sales: 35, revenue: 168, icon: '🍺' },
              { name: 'Classic Beef Burger', sales: 28, revenue: 462, icon: '🍔' },
              { name: 'Tiramisu', sales: 25, revenue: 172, icon: '☕' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div className="text-white font-medium">{item.name}</div>
                    <div className="text-gray-400 text-xs">{item.sales} sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-accent font-semibold">€{item.revenue}</div>
                  <div className="text-green-400 text-xs">+12%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kitchen Performance */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Kitchen Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Prep Time</span>
              <span className="text-green-400 font-semibold">12.4 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Orders in Queue</span>
              <span className="text-amber-400 font-semibold">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Completion Rate</span>
              <span className="text-green-400 font-semibold">94.7%</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-green-400 text-sm">Kitchen running efficiently</div>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Top Performers</h3>
          <div className="space-y-3">
            {[
              { name: 'Anna Schmidt', sales: '€2,850', tables: 8, avatar: '👩‍💼' },
              { name: 'Thomas Müller', sales: '€2,150', tables: 6, avatar: '👨‍💼' },
              { name: 'Sarah Weber', sales: '€1,980', tables: 5, avatar: '👩‍🍳' }
            ].map((staff, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-lg">{staff.avatar}</div>
                  <div>
                    <div className="text-white text-sm font-medium">{staff.name}</div>
                    <div className="text-gray-400 text-xs">{staff.tables} tables</div>
                  </div>
                </div>
                <div className="text-accent font-semibold text-sm">{staff.sales}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>📊</span>
              <span>Generate Daily Report</span>
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>👥</span>
              <span>Manage Staff Schedule</span>
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>🍽️</span>
              <span>Update Menu Items</span>
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>🔄</span>
              <span>Inventory Check</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Analytics Tab
  const AnalyticsTab = () => (
    <div className="space-y-6">
      {/* Advanced Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">€12,450</div>
          <div className="text-purple-400 text-sm">Total Revenue</div>
          <div className="text-green-400 text-xs mt-1">↑ 12.5% from last week</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">284</div>
          <div className="text-blue-400 text-sm">Total Orders</div>
          <div className="text-green-400 text-xs mt-1">↑ 8.3% from last week</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">€43.82</div>
          <div className="text-green-400 text-sm">Avg Order Value</div>
          <div className="text-green-400 text-xs mt-1">↑ 3.2% from last week</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">2.8</div>
          <div className="text-orange-400 text-sm">Avg Table Turnover</div>
          <div className="text-red-400 text-xs mt-1">↓ 0.3 from last week</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Trend */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-6">Weekly Revenue Trend</h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-48 gap-2">
              {analyticsData.weeklyTrend.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300 hover:from-cyan-500 hover:to-cyan-400 cursor-pointer"
                    style={{ height: `${(day.revenue / 7000) * 100}%` }}
                  >
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs whitespace-nowrap z-10">
                      <div className="text-white font-semibold">€{day.revenue}</div>
                      <div className={day.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                        {day.growth > 0 ? '↑' : '↓'} {Math.abs(day.growth).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-2">{day.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-6">Payment Methods</h3>
          <div className="space-y-4">
            {analyticsData.paymentMethods.map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{method.method}</span>
                  <span className="text-white font-medium">{method.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${method.percentage}%`,
                      background: `linear-gradient(90deg, ${['#10B981', '#3B82F6', '#8B5CF6', '#6B7280'][index]}, ${['#34D399', '#60A5FA', '#A78BFA', '#9CA3AF'][index]})`
                    }}
                  />
                </div>
                <div className="text-gray-400 text-xs">€{method.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Peak Hours</h3>
          <div className="space-y-3">
            {['12:00-14:00', '18:00-20:00', '20:00-22:00'].map((time, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">{time}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${80 - index * 20}%` }} />
                  </div>
                  <span className="text-white text-sm font-medium">{80 - index * 20}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Customer Satisfaction</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">4.7/5</div>
            <div className="text-yellow-400 text-lg">★★★★☆</div>
            <div className="text-gray-400 text-sm mt-2">Based on 128 reviews</div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Table Utilization</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Peak Hours</span>
              <span className="text-green-400 text-sm font-medium">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Off-Peak</span>
              <span className="text-blue-400 text-sm font-medium">65%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Overall</span>
              <span className="text-purple-400 text-sm font-medium">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Menu Management Tab
  const MenuManagementTab = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['all', 'Drinks', 'Appetizers', 'Main Courses', 'Desserts'];

    // Filter menu items
    const filteredItems = useMemo(() => {
      let filtered = extendedMenuItems;
      
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
      
      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return filtered;
    }, [extendedMenuItems, selectedCategory, searchTerm]);

    return (
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white font-semibold text-xl">Menu Management</h2>
            <p className="text-gray-400">Manage your restaurant menu items</p>
          </div>
          <button 
            onClick={() => setEditModal({ type: 'menu', data: null, isEditing: false })}
            className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Add New Item</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Menu Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{extendedMenuItems.filter(m => m.category === 'Drinks').length}</div>
            <div className="text-blue-400 text-sm">Drinks</div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{extendedMenuItems.filter(m => m.category === 'Appetizers').length}</div>
            <div className="text-green-400 text-sm">Appetizers</div>
          </div>
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{extendedMenuItems.filter(m => m.category === 'Main Courses').length}</div>
            <div className="text-orange-400 text-sm">Main Courses</div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{extendedMenuItems.filter(m => m.category === 'Desserts').length}</div>
            <div className="text-purple-400 text-sm">Desserts</div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-200 group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold truncate group-hover:text-primary transition-colors">
                      {item.name}
                    </div>
                    <div className="text-gray-400 text-sm">{item.category}</div>
                  </div>
                </div>
                <div className="text-accent font-bold text-lg shrink-0">€{item.price.toFixed(2)}</div>
              </div>
              
              <div className="flex justify-between items-center text-sm mb-3">
                <div className="text-gray-400">VAT {item.vat}%</div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {(item.tags || []).slice(0, 2).map(tag => (
                    <span key={tag} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {(item.tags || []).length > 2 && (
                    <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                      +{(item.tags || []).length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Popularity Indicator */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Popularity</span>
                  <span>{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setEditModal({ type: 'menu', data: item, isEditing: true })}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                      console.log('Delete item:', item.id);
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <span>🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <div className="text-gray-400 text-xl mb-2">No menu items found</div>
            <div className="text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}

        {/* Bulk Actions */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Bulk Actions</h3>
          <div className="flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              Export Menu
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Update Prices
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Print Menu
            </button>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
              Set Seasonal Items
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Tables Management Tab
  const TablesManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-semibold text-xl">Table Management</h2>
        <button 
          onClick={() => setEditModal({ type: 'table', data: null, isEditing: false })}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>Add New Table</span>
        </button>
      </div>

      {/* Table Status Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{tableStats.occupiedTables}</div>
          <div className="text-green-400 text-sm">Occupied</div>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{tableStats.freeTables}</div>
          <div className="text-blue-400 text-sm">Available</div>
        </div>
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{tables.filter(t => t.status === 'cleaning').length}</div>
          <div className="text-amber-400 text-sm">Cleaning</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{tables.filter(t => t.status === 'reserved').length}</div>
          <div className="text-purple-400 text-sm">Reserved</div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {extendedTables.map((table) => (
          <div key={table.id} className={`border-2 rounded-xl p-4 transition-all duration-200 hover:scale-105 cursor-pointer ${
            table.status === 'occupied' ? 'border-green-500 bg-green-500/10' :
            table.status === 'free' ? 'border-blue-500 bg-blue-500/10' :
            'border-amber-500 bg-amber-500/10'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-white font-bold text-lg">{table.name}</div>
                <div className="text-gray-400 text-sm">{table.location}</div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                table.status === 'occupied' ? 'bg-green-500 text-white' :
                table.status === 'free' ? 'bg-blue-500 text-white' :
                'bg-amber-500 text-white'
              }`}>
                {table.status.toUpperCase()}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity:</span>
                <span className="text-white">{table.capacity || 4} seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current:</span>
                <span className="text-amber-400">{table.guests} guests</span>
              </div>
              {table.waiter && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Waiter:</span>
                  <span className="text-blue-400">{table.waiter}</span>
                </div>
              )}
              {table.currentOrderId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Order:</span>
                  <span className="text-green-400">Active</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setEditModal({ type: 'table', data: table, isEditing: true })}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition-colors"
              >
                Edit
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm transition-colors">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floor Plan Preview */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mt-6">
        <h3 className="text-white font-semibold text-lg mb-4">Restaurant Floor Plan</h3>
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-900/50 rounded-lg">
          {['Window 1', 'Window 2', 'Center 1', 'Center 2', 'Corner 1', 'Bar 1', 'Bar 2', 'Terrace 1'].map((table, index) => (
            <div key={index} className={`p-3 rounded-lg text-center text-sm font-medium ${
              index % 3 === 0 ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
              index % 3 === 1 ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' :
              'bg-amber-500/20 border border-amber-500/30 text-amber-400'
            }`}>
              {table}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Staff Management Tab
  const StaffManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-semibold text-xl">Staff Management</h2>
        <button 
          onClick={() => setEditModal({ type: 'staff', data: null, isEditing: false })}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{staffData.length}</div>
          <div className="text-gray-400 text-sm">Total Staff</div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{staffData.filter(s => s.status === 'active').length}</div>
          <div className="text-green-400 text-sm">Active Now</div>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {(staffData.reduce((sum, staff) => sum + staff.rating, 0) / staffData.length).toFixed(1)}
          </div>
          <div className="text-blue-400 text-sm">Avg Rating</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            €{staffData.reduce((sum, staff) => sum + staff.revenue, 0).toLocaleString()}
          </div>
          <div className="text-purple-400 text-sm">Total Revenue</div>
        </div>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staffData.map((staff) => (
          <div key={staff.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{staff.avatar}</div>
                <div>
                  <div className="text-white font-semibold text-lg">{staff.name}</div>
                  <div className="text-gray-400 text-sm">{staff.role}</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                staff.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                staff.status === 'break' ? 'bg-amber-500/20 text-amber-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {staff.status.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-white font-bold text-xl">{staff.tables}</div>
                <div className="text-gray-400 text-xs">Tables</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">€{staff.revenue}</div>
                <div className="text-gray-400 text-xs">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">{staff.rating}</div>
                <div className="text-gray-400 text-xs">Rating</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setEditModal({ type: 'staff', data: staff, isEditing: true })}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition-colors"
              >
                Edit
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm transition-colors">
                Performance
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm transition-colors">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shift Schedule */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {[
            { name: 'Anna Schmidt', shift: '09:00 - 17:00', role: 'Head Waiter' },
            { name: 'Thomas Müller', shift: '12:00 - 20:00', role: 'Senior Waiter' },
            { name: 'Sarah Weber', shift: '16:00 - 00:00', role: 'Waiter' },
            { name: 'Michael Bauer', shift: '10:00 - 18:00', role: 'Trainee' }
          ].map((schedule, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  {schedule.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-medium">{schedule.name}</div>
                  <div className="text-gray-400 text-xs">{schedule.role}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-semibold">{schedule.shift}</div>
                <div className="text-green-400 text-xs">● On Duty</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Settings Tab
  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Settings */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Restaurant Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Restaurant Name</label>
              <input 
                type="text" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                defaultValue="NEXUS Fine Dining"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Address</label>
              <input 
                type="text" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                defaultValue="123 Gourmet Street, Berlin"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Phone</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                  defaultValue="+49 30 12345678"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                  defaultValue="info@nexus-dining.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Business Hours</h3>
          <div className="space-y-3">
            {[
              { day: 'Monday - Friday', hours: '11:00 - 23:00' },
              { day: 'Saturday', hours: '10:00 - 00:00' },
              { day: 'Sunday', hours: '10:00 - 22:00' }
            ].map((schedule, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">{schedule.day}</span>
                <span className="text-white font-medium">{schedule.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">POS Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Print Receipts Automatically</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Require Manager Approval</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Enable Table Reservations</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* VAT Configuration */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Tax Settings</h3>
          <div className="space-y-3">
            {[
              { rate: '19%', description: 'Standard VAT', appliesTo: 'Food, Services' },
              { rate: '7%', description: 'Reduced VAT', appliesTo: 'Beverages' }
            ].map((tax, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{tax.rate}</span>
                  <span className="text-gray-400 text-sm">{tax.description}</span>
                </div>
                <div className="text-gray-400 text-xs">{tax.appliesTo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
          Save Changes
        </button>
        <button className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
          Reset to Defaults
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
          System Backup
        </button>
      </div>
    </div>
  );

  // Enhanced Edit Modal
  const EditModal = () => {
    if (!editModal) return null;

    const { type, data, isEditing } = editModal;

    const handleSave = () => {
      // In a real app, you would save to your backend here
      console.log('Saving:', { type, data });
      setEditModal(null);
    };

    const handleDelete = () => {
      if (confirm(`Are you sure you want to delete this ${type}?`)) {
        console.log('Deleting:', { type, data });
        setEditModal(null);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Edit' : 'Add New'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <button
              onClick={() => setEditModal(null)}
              className="text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {type === 'menu' && (
              <>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Item Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                    defaultValue={data?.name || ''}
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Category</label>
                  <select 
                    defaultValue={data?.category || 'Drinks'}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Drinks">Drinks</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Courses">Main Courses</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Price (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                      defaultValue={data?.price || 0}
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">VAT (%)</label>
                    <select 
                      defaultValue={data?.vat || 19}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="7">7%</option>
                      <option value="19">19%</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {['🍽️', '🍔', '🍕', '🍝', '🥗', '🍺', '☕', '🍰', '🍷', '🥃'].map(icon => (
                      <button
                        key={icon}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                          data?.icon === icon ? 'border-primary bg-primary/20' : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Tags</label>
                  <div className="flex gap-2 flex-wrap">
                    {['popular', 'vegetarian', 'quick', 'healthy', 'premium', 'signature'].map(tag => (
                      <label key={tag} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          className="rounded bg-gray-700 border-gray-600" 
                          defaultChecked={data?.tags?.includes(tag)}
                        />
                        <span className="text-gray-300 text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {type === 'table' && (
              <>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Table Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                    defaultValue={data?.name || ''}
                    placeholder="e.g., Table 1 - Window"
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Location</label>
                  <select 
                    defaultValue={data?.location || 'Main Dining'}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Main Dining">Main Dining</option>
                    <option value="Terrace">Terrace</option>
                    <option value="Bar">Bar</option>
                    <option value="Private Room">Private Room</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Capacity</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                    defaultValue={data?.capacity || 4}
                    min="1"
                    max="12"
                  />
                </div>
              </>
            )}

            {type === 'staff' && (
              <>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Staff Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                    defaultValue={data?.name || ''}
                    placeholder="Enter staff name"
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Role</label>
                  <select 
                    defaultValue={data?.role || 'Waiter'}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Head Waiter">Head Waiter</option>
                    <option value="Senior Waiter">Senior Waiter</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Avatar</label>
                  <div className="flex gap-2 flex-wrap">
                    {['👩‍💼', '👨‍💼', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓'].map(avatar => (
                      <button
                        key={avatar}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                          data?.avatar === avatar ? 'border-primary bg-primary/20' : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
            {isEditing && (
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => setEditModal(null)}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/80 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NEXUS POS Dashboard
          </h1>
          <p className="text-gray-400">Real-time analytics and management</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
          
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Locations</option>
            <option value="Main Dining">Main Dining</option>
            <option value="Terrace">Terrace</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'analytics', label: 'Analytics', icon: '📈' },
          { id: 'menu', label: 'Menu Management', icon: '🍽️' },
          { id: 'tables', label: 'Tables', icon: '🪑' },
          { id: 'staff', label: 'Staff', icon: '👥' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'menu' && <MenuManagementTab />}
        {activeTab === 'tables' && <TablesManagementTab />}
        {activeTab === 'staff' && <StaffManagementTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* Edit Modal */}
      <EditModal />
    </div>
  );
};

export default Dashboard;