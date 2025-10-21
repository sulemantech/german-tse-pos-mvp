import React, { useState } from 'react';
import Header from './components/header';
import TablesPanel from './components/TablesPanel';
import OrderInterface from './components/OrderInterface';
import PaymentTerminal from './components/PaymentTerminal';
import FloatingActions from './components/FloatingActions';
import { usePOS } from './hooks/usePOS';

const App: React.FC = () => {
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

  // Fix: Explicitly return Promise<void>
  const handleProcessPayment = async (paymentMethod: string): Promise<void> => {
    if (!currentTable) return;
    
    // Generate TSE signature
    const tseSignature = `TSE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Complete the order
    completeOrder(currentTable.id, paymentMethod, tseSignature);
    
    // Simulate processing delay - explicitly return void
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

export default App;