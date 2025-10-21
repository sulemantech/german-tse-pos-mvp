import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import TablesPanel from './components/TablesPanel';
import OrderInterface from './components/OrderInterface';
import PaymentTerminal from './components/PaymentTerminal';
import FloatingActions from './components/FloatingActions';
import KitchenView from './components/KitchenView';
import Dashboard from './components/Dashboard';
import { usePOS } from './hooks/usePOS';
import type { Table, Order } from './types';

// Main POS Component (your existing app)
const POSInterface: React.FC = () => {
  const {
    tables,
    menuItems,
    currentTable,
    currentOrder,
    selectedCategory,
    tableStats,
    selectTable,
    startNewOrder,
    completeOrder,
    freeTable,
    updateQuantity,
    removeItem,
    addToOrder,
    setSelectedCategory,
    getOrderDuration,
    calculateVATBreakdown
  } = usePOS();

  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  const handleProcessPayment = async (paymentMethod: string): Promise<void> => {
    if (!currentTable) return;
    
    const tseSignature = `TSE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    completeOrder(currentTable.id, paymentMethod, tseSignature);
    await new Promise<void>(resolve => setTimeout(resolve, 2000));
  };

  const handleVoiceCommand = () => {
    setShowVoiceInterface(!showVoiceInterface);
  };

  const handleAIAssistant = () => {
    showNotification('🧠 AI Assistant: I can help optimize table turnover');
  };

  const handleAnalytics = () => {
    showNotification(`📊 Analytics: ${tableStats.occupiedTables} tables occupied, €${tableStats.revenueToday} revenue`);
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-5 bg-secondary text-white px-4 py-3 rounded-lg shadow-glow-secondary z-50 animate-slide-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('animate-slide-in');
      notification.classList.add('animate-slide-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-white overflow-hidden">
      <div className="nexus-container">
        <Header />
        
        <TablesPanel
          tables={tables}
          currentTable={currentTable}
          onSelectTable={selectTable}
          getOrderDuration={getOrderDuration}
          onFreeTable={freeTable}
          onStartNewOrder={startNewOrder}
        />
        
        <OrderInterface
          currentTable={currentTable}
          currentOrder={currentOrder}
          menuItems={menuItems}
          selectedCategory={selectedCategory}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onAddToOrder={addToOrder}
          onCategoryChange={setSelectedCategory}
          getOrderDuration={getOrderDuration}
        />
        
        <PaymentTerminal
          currentTable={currentTable}
          currentOrder={currentOrder}
          calculateVATBreakdown={calculateVATBreakdown}
          onProcessPayment={handleProcessPayment}
          onStartNewOrder={startNewOrder}
        />
      </div>

      <FloatingActions
        onVoiceCommand={handleVoiceCommand}
        onAIAssistant={handleAIAssistant}
        onAnalytics={handleAnalytics}
      />

      {showVoiceInterface && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-600 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-semibold text-center mb-6">
              VOICE COMMAND ACTIVE
            </h3>
            
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 h-5 bg-blue-500 rounded-full animate-voice-wave"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
            
            <p className="text-gray-300 text-center text-sm mb-6">
              Say "Start order table 1" or "Process payment table 2"
            </p>
            
            <button
              className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors duration-200"
              onClick={handleVoiceCommand}
            >
              Stop Listening
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated Header with Navigation
const NavigationHeader: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-card backdrop-blur-xl border-b border-glass px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-white">NEXUS POS</h1>
          
          <nav className="flex gap-4">
            <a 
              href="/" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-primary text-white shadow-glow-primary' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🏠 POS Interface
            </a>
            
            <a 
              href="/kitchen" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/kitchen' 
                  ? 'bg-orange-500 text-white shadow-glow' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              👨‍🍳 Kitchen Display
            </a>

            {/* Add Dashboard Link */}
            <a 
              href="/dashboard" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/dashboard' 
                  ? 'bg-purple-500 text-white shadow-glow' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              📊 Dashboard
            </a>
          </nav>
        </div>
        
        <div className="text-gray-400 text-sm">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
};

// Updated FloatingActions with Dashboard Link
const NavigationFloatingActions: React.FC<{ 
  onVoiceCommand: () => void; 
  onAIAssistant: () => void; 
  onAnalytics: () => void;
}> = ({
  onVoiceCommand,
  onAIAssistant,
  onAnalytics
}) => {
  const location = useLocation();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Dashboard Button */}
      <a 
        href="/dashboard"
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 ${
          location.pathname === '/dashboard' 
            ? 'bg-purple-500' 
            : 'bg-purple-600 hover:bg-purple-500'
        }`}
        title="Dashboard & Analytics"
      >
        📊
      </a>

      {/* Kitchen Button */}
      <a 
        href="/kitchen"
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 ${
          location.pathname === '/kitchen' 
            ? 'bg-orange-500' 
            : 'bg-orange-600 hover:bg-orange-500'
        }`}
        title="Kitchen Display"
      >
        👨‍🍳
      </a>
      
      <button
        onClick={onVoiceCommand}
        className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
        title="Voice Commands"
      >
        🎤
      </button>
      
      <button
        onClick={onAIAssistant}
        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
        title="AI Assistant"
      >
        🧠
      </button>
      
      <button
        onClick={onAnalytics}
        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
        title="Quick Analytics"
      >
        📈
      </button>
    </div>
  );
};

// Helper function to extract all orders from tables
const getAllOrders = (tables: Table[]): Order[] => {
  return tables.flatMap(table => table.orderHistory);
};

// Create proper handler for kitchen item status updates
const handleUpdateItemStatus = (
  orderId: string, 
  itemIndex: number, 
  status: 'pending' | 'preparing' | 'ready' | 'served'
) => {
  console.log(`Kitchen: Update item ${itemIndex} in order ${orderId} to ${status}`);
};

// Mock function for priority changes
const handlePriorityChange = (orderId: string, priority: 'low' | 'normal' | 'high') => {
  console.log(`Priority changed for order ${orderId}: ${priority}`);
};

// Main App Component with Router
const App: React.FC = () => {
  const {
    tables,
    menuItems,
    completeOrder
  } = usePOS();

  // Get all orders for dashboard
  const allOrders = getAllOrders(tables);

  // Calculate dashboard stats
  const tableStats = {
    totalTables: tables.length,
    occupiedTables: tables.filter(t => t.status === 'occupied').length,
    freeTables: tables.filter(t => t.status === 'free').length,
    averageOrderTime: 45,
    revenueToday: allOrders
      .filter(order => order.status === 'completed' || order.status === 'paid')
      .reduce((total, order) => total + order.total, 0)
  };

  // Prepare kitchen orders with proper typing
  const kitchenOrders = tables.flatMap(table => 
    table.orderHistory
      .filter(order => order.status === 'active')
      .map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          status: (item.status as 'pending' | 'preparing' | 'ready' | 'served') || 'pending',
          priority: item.priority || 'normal'
        })),
        priority: order.priority || 'normal'
      }))
  );

  return (
    <Router>
      {/* Global Navigation Header and Floating Actions - Available on ALL pages */}
      <div className="min-h-screen bg-gray-900">
        <NavigationHeader />
        <NavigationFloatingActions 
          onVoiceCommand={() => {}}
          onAIAssistant={() => {}}
          onAnalytics={() => {}}
        />
        
        <Routes>
          {/* Main POS Interface */}
          <Route path="/" element={<POSInterface />} />
          
          {/* Kitchen Display - Full Screen */}
          <Route path="/kitchen" element={
            <KitchenView
              orders={kitchenOrders}
              tables={tables}
              onUpdateItemStatus={handleUpdateItemStatus}
              onCompleteOrder={(orderId: string) => {
                const table = tables.find(t => t.orderHistory.some(o => o.id === orderId));
                if (table) {
                  completeOrder(table.id, 'cash', `TSE_${Date.now()}`);
                }
              }}
              onPriorityChange={handlePriorityChange}
            />
          } />

          {/* Dashboard - Analytics & Management */}
          <Route path="/dashboard" element={
            <Dashboard
              tables={tables}
              menuItems={menuItems}
              orders={allOrders}
              tableStats={tableStats}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;