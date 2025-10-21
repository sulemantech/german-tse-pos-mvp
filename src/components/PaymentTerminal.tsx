import React, { useState } from 'react';
import type { Table, VATBreakdown, Order } from '../types';

interface PaymentTerminalProps {
  currentTable: Table | null;
  currentOrder: Order | null;
  calculateVATBreakdown: (items: any[]) => VATBreakdown;
  onProcessPayment: (paymentMethod: string) => Promise<void>;
  onStartNewOrder?: (tableId: string, guests: number) => void; // Add if needed
}

const PaymentTerminal: React.FC<PaymentTerminalProps> = ({
  currentTable,
  currentOrder,
  calculateVATBreakdown,
  onProcessPayment,
  onStartNewOrder
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newOrderGuests, setNewOrderGuests] = useState(1);

  const paymentMethods = [
    { id: 'cash', icon: '💵', label: 'Cash' },
    { id: 'card', icon: '💳', label: 'Card' },
    { id: 'mobile', icon: '📱', label: 'Mobile' },
    { id: 'split', icon: '🎫', label: 'Split' }
  ];

  const handlePayment = async () => {
    if (!currentTable || !currentOrder || !selectedPayment) return;
    
    setIsProcessing(true);
    await onProcessPayment(selectedPayment);
    setIsProcessing(false);
  };

  const handleStartNewOrder = () => {
    if (!currentTable) return;
    onStartNewOrder?.(currentTable.id, newOrderGuests);
    setNewOrderGuests(1);
  };

  const breakdown = currentOrder 
    ? calculateVATBreakdown(currentOrder.items)
    : { vat7: 0, vat19: 0, net7: 0, net19: 0 };

  const totalVAT = breakdown.vat7 + breakdown.vat19;

  return (
    <aside className="glass-panel border-l p-5 flex flex-col gap-4 h-[calc(100vh-70px)] overflow-y-auto">
      <div className="bg-gradient-dark border border-blue-400 rounded-xl p-5 flex-1 flex flex-col shadow-glow-primary">
        {/* Order Status */}
        <div className="mb-4">
          {!currentTable ? (
            <div className="text-center text-gray-400 py-8">
              Select a table to view order
            </div>
          ) : !currentOrder ? (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-4">No active order</div>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <label className="text-gray-400 text-sm">Guests:</label>
                  <select 
                    value={newOrderGuests}
                    onChange={(e) => setNewOrderGuests(Number(e.target.value))}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleStartNewOrder}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Start New Order
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Total Amount */}
              <div className="text-center mb-6">
                <div className="text-gray-400 text-sm uppercase tracking-wide mb-2">AMOUNT DUE</div>
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  €{currentOrder.total.toFixed(2)}
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  Order active for {Math.floor((new Date().getTime() - new Date(currentOrder.startTime).getTime()) / 60000)} minutes
                </div>
              </div>

              {/* VAT Breakdown */}
              <div className="mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Net Amount (19%):</span>
                    <span className="text-white">€{breakdown.net19.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Net Amount (7%):</span>
                    <span className="text-white">€{breakdown.net7.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-blue-400 font-semibold mt-2 pt-2">
                    <span className="text-white">Total VAT:</span>
                    <span className="text-white">€{totalVAT.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    className={`quantum-pay-btn ${selectedPayment === method.id ? 'active' : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="text-white text-sm font-medium">{method.label}</div>
                  </button>
                ))}
              </div>

              {/* Process Payment Button */}
              <button
                className="process-payment-btn"
                onClick={handlePayment}
                disabled={!currentOrder || isProcessing || !selectedPayment}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin">⚡</div>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <div>⚡</div>
                    PROCESS PAYMENT - €{currentOrder.total.toFixed(2)}
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* AI Suggestions */}
        <div className="mt-auto">
          <div className="suggestion-item">
            <span className="suggestion-badge">AI TIP</span>
            <span className="text-green-400">
              {!currentTable 
                ? 'Select a table to begin' 
                : !currentOrder 
                ? 'Start new order to increase table turnover'
                : 'Suggest desserts - 68% order rate after main courses'
              }
            </span>
          </div>
        </div>
      </div>

      {/* TSE Neural */}
      <div className="tse-neural">
        <div className="neural-wave">
          <div className="wave-icon">🔒</div>
          <div className="wave-animation"></div>
          <div className="wave-status">TSE ACTIVE</div>
        </div>
        <div className="tse-details">
          <div>Signature #1,248 Ready</div>
          <div>Certificate Valid Until 2026-12-31</div>
        </div>
      </div>
    </aside>
  );
};

export default PaymentTerminal;