import React, { useState, useMemo } from 'react';
import type { Table, MenuItem, Order } from '../types';

interface OrderInterfaceProps {
    currentTable: Table | null;
    currentOrder: Order | null;
    menuItems: MenuItem[];
    selectedCategory: string;
    onUpdateQuantity: (itemIndex: number, change: number) => void;
    onRemoveItem: (itemIndex: number) => void;
    onAddToOrder: (menuItem: MenuItem) => void;
    onCategoryChange: (category: string) => void;
    getOrderDuration: (startTime: string) => string;
}

const OrderInterface: React.FC<OrderInterfaceProps> = ({
    currentTable,
    currentOrder,
    menuItems,
    selectedCategory,
    onUpdateQuantity,
    onRemoveItem,
    onAddToOrder,
    onCategoryChange,
    getOrderDuration
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const categories = ['All', 'Drinks', 'Appetizers', 'Main Courses', 'Desserts'];

    const quickActions = [
        { id: 'DRINK_WATER', label: 'Water', icon: '💧', itemId: 'DRINK_WATER' },
        { id: 'DRINK_BEER_05', label: 'Beer', icon: '🍺', itemId: 'DRINK_BEER_05' },
        { id: 'DRINK_COFFEE', label: 'Coffee', icon: '☕', itemId: 'DRINK_COFFEE' },
        { id: 'MAIN_BURGER', label: 'Burger', icon: '🍔', itemId: 'MAIN_BURGER' },
        { id: 'MAIN_PIZZA', label: 'Pizza', icon: '🍕', itemId: 'MAIN_PIZZA' },
        { id: 'DESSERT_CAKE', label: 'Cake', icon: '🍰', itemId: 'DESSERT_CAKE' }
    ];

    // Filter menu items based on category and search
    const filteredMenuItems = useMemo(() => {
        let filtered = selectedCategory === 'All'
            ? menuItems
            : menuItems.filter(item => item.category === selectedCategory);

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [menuItems, selectedCategory, searchTerm]);

    // Check if we should show single item layout
    const shouldShowSingleItemLayout = filteredMenuItems.length === 1;

    const handleQuickAction = (itemId: string) => {
        const menuItem = menuItems.find(item => item.id === itemId);
        if (menuItem) {
            onAddToOrder(menuItem);
        }
    };

    const getSafeOrderDuration = () => {
        if (!currentOrder || !currentOrder.startTime) return '0m';
        return getOrderDuration(currentOrder.startTime);
    };

    // Calculate order total
    const orderTotal = currentOrder?.items.reduce((total, item) =>
        total + (item.price * item.quantity), 0) || 0;

    return (
        <main className="bg-card backdrop-blur-xl border border-glass p-3 flex flex-col gap-2 h-[calc(100vh-70px)] overflow-hidden">
            {/* Header - More Compact */}
            <div className="bg-glass rounded-lg p-2 border border-glass flex justify-between items-center">
                <h2 className="text-white font-semibold text-sm">
                    {currentTable ? currentTable.name : 'SELECT A TABLE'}
                </h2>

                <div className="flex items-center gap-1">
                    {currentTable && currentTable.status === 'occupied' && currentOrder && (
                        <div className="flex items-center gap-1 text-xs">
                            <span className="text-white">👥{currentTable.guests}</span>
                            <span className="text-accent text-xs">
                                • {getSafeOrderDuration()}
                            </span>
                        </div>
                    )}
                    <button className="w-5 h-5 rounded bg-gray-700/50 hover:bg-primary transition-all duration-200 flex items-center justify-center text-white text-xs">
                        🧠
                    </button>
                    <button className="w-5 h-5 rounded bg-gray-700/50 hover:bg-primary transition-all duration-200 flex items-center justify-center text-white text-xs">
                        🎤
                    </button>
                </div>
            </div>

            {/* Order Display & Menu Container */}
            <div className="bg-glass rounded-lg p-2 border border-glass flex flex-col gap-2 flex-1 overflow-hidden">
                {/* Enhanced Order Display - Much Better UX */}
                <div className="bg-gray-900/20 rounded-lg border border-glass p-3 flex-1 max-h-[200px] min-h-[120px] overflow-y-auto">
                    {!currentTable ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                            <div className="text-2xl mb-2">🪑</div>
                            Select a table to start ordering
                        </div>
                    ) : !currentOrder || currentOrder.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                            <div className="text-2xl mb-2">
                                {currentTable.status === 'occupied' ? '📝' : '🔒'}
                            </div>
                            {currentTable.status === 'occupied'
                                ? 'No items - Add from menu below'
                                : 'Table not occupied'
                            }
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {currentOrder.items.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border-l-4 border-primary hover:bg-gray-700/50 transition-all duration-150 group"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="text-2xl flex-shrink-0">{item.icon || '📦'}</div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-white font-semibold text-sm truncate">
                                                {item.name}
                                            </div>
                                            <div className="text-gray-400 text-xs flex items-center gap-2">
                                                {item.notes && (
                                                    <span className="truncate">{item.notes}</span>
                                                )}
                                                <span>VAT {item.vat}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="text-accent font-bold text-sm whitespace-nowrap">
                                            €{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <div className="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
                                            <button
                                                onClick={() => onUpdateQuantity(index, -1)}
                                                className="w-6 h-6 rounded bg-gray-600 hover:bg-danger transition-all duration-150 flex items-center justify-center text-white text-sm font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="text-white font-bold text-sm min-w-[20px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => onUpdateQuantity(index, 1)}
                                                className="w-6 h-6 rounded bg-gray-600 hover:bg-secondary transition-all duration-150 flex items-center justify-center text-white text-sm font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => onRemoveItem(index)}
                                            className="w-6 h-6 rounded bg-gray-600 hover:bg-danger transition-all duration-150 flex items-center justify-center text-red-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove item"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Order Total */}
                            <div className="flex justify-between items-center p-3 bg-primary/20 rounded-lg border border-primary/30 mt-4">
                                <div className="text-white font-bold text-sm">ORDER TOTAL</div>
                                <div className="text-accent font-bold text-lg">
                                    €{orderTotal.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="🔍 Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/30 border border-glass rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:shadow-glow"
                />

                {/* Enhanced Categories - More Compact */}
                <div className="flex gap-1 flex-wrap">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${selectedCategory === category
                                ? 'bg-primary border-primary text-white shadow-glow-primary'
                                : 'bg-gray-700/30 border-glass text-gray-300 hover:border-primary'
                                }`}
                            onClick={() => onCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Quick Actions Bar - Ultra Compact */}
                <div className="grid grid-cols-6 gap-1">
                    {quickActions.map(action => (
                        <button
                            key={action.id}
                            className="flex flex-col items-center p-2 border border-glass rounded-lg bg-gray-700/30 hover:bg-primary transition-all duration-150 text-gray-300 hover:text-white text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => handleQuickAction(action.itemId)}
                            disabled={!currentTable || currentTable.status !== 'occupied'}
                            title={action.label}
                        >
                            <span className="text-base">{action.icon}</span>
                            <span className="text-[10px] leading-tight mt-1">{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* Compact Menu Grid - Simplified */}
<div className={`grid overflow-y-auto flex-1 p-2 ${
  shouldShowSingleItemLayout 
    ? 'grid-cols-1 gap-4' 
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'
}`}>
  {filteredMenuItems.map(item => (
    <div
  key={item.id}
  className="bg-gradient-card border border-glass rounded-lg p-3 text-center cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-glow hover:translate-y-[-2px] flex flex-col items-center justify-center gap-2 h-[120px]"
  onClick={() => onAddToOrder(item)}
  title={item.name}
>
  <div className="text-2xl mb-1">{item.icon}</div>
  <div className="text-white font-semibold text-sm leading-tight line-clamp-2 flex items-center justify-center min-h-[40px]">
    {item.name}
  </div>
  <div className="text-accent font-bold text-base mt-1">
    €{item.price.toFixed(2)}
  </div>
</div>
  ))}
</div>
                {/* Results Count */}
                {filteredMenuItems.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-4">
                        No items found{searchTerm ? ` for "${searchTerm}"` : ''}
                    </div>
                )}
            </div>
        </main>
    );
};

export default OrderInterface;