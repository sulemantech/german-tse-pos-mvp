import React, { useState, useMemo, useEffect } from 'react';
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
    const [marqueePosition, setMarqueePosition] = useState(0);
    
    // Define categories in the order they should appear (eating sequence)
    const categories = ['All', 'Drinks', 'Appetizers', 'Main Courses', 'Desserts'];

    const quickActions = [
        { id: 'DRINK_WATER', label: 'Water', icon: '🥤', itemId: 'DRINK_WATER' },
        { id: 'DRINK_BEER_05', label: 'Beer', icon: '🍺', itemId: 'DRINK_BEER_05' },
        { id: 'DRINK_COFFEE', label: 'Coffee', icon: '☕', itemId: 'DRINK_COFFEE' },
        { id: 'MAIN_BURGER_CLASSIC', label: 'Burger', icon: '🍔', itemId: 'MAIN_BURGER_CLASSIC' },
        { id: 'MAIN_PIZZA_MARGHERITA', label: 'Pizza', icon: '🍕', itemId: 'MAIN_PIZZA_MARGHERITA' },
        { id: 'DESSERT_CAKE', label: 'Cake', icon: '🍰', itemId: 'DESSERT_CAKE' }
    ];

    // Helper function to get menu item details by ID
    const getMenuItemById = (itemId: string): MenuItem | undefined => {
        return menuItems.find(item => item.id === itemId);
    };

    // Helper function to get category for an order item
    const getItemCategory = (itemId: string): string => {
        const menuItem = getMenuItemById(itemId);
        return menuItem?.category || 'Other';
    };

    // Helper function to get icon for an order item
    const getItemIcon = (itemId: string): string => {
        const menuItem = getMenuItemById(itemId);
        return menuItem?.icon || '📦';
    };

    // Filter menu items based on category and search - SORTED BY EATING ORDER
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

        // Sort by eating sequence: Appetizers -> Main Courses -> Desserts -> Drinks
        const categoryOrder = ['Appetizers', 'Main Courses', 'Desserts', 'Drinks'];
        return filtered.sort((a, b) => {
            const aIndex = categoryOrder.indexOf(a.category);
            const bIndex = categoryOrder.indexOf(b.category);
            return aIndex - bIndex;
        });
    }, [menuItems, selectedCategory, searchTerm]);

    // Calculate order summary for the header - FIXED VERSION
    const orderSummary = useMemo(() => {
        if (!currentOrder || !currentOrder.items.length) return null;

        const itemsByType = currentOrder.items.reduce((acc, orderItem) => {
            const category = getItemCategory(orderItem.id);
            if (!acc[category]) {
                acc[category] = { totalQuantity: 0, items: [] };
            }
            acc[category].totalQuantity += orderItem.quantity;
            acc[category].items.push(`${orderItem.name} (${orderItem.quantity})`);
            return acc;
        }, {} as Record<string, { totalQuantity: number; items: string[] }>);

        // Create summary text
        const summaryParts = [];
        for (const [category, data] of Object.entries(itemsByType)) {
            summaryParts.push(`${category}: ${data.totalQuantity} items`);
        }

        // Create detailed item list for marquee with proper icons
        const itemDetails = currentOrder.items.flatMap(orderItem => 
            Array.from({ length: orderItem.quantity }, () => 
                `${getItemIcon(orderItem.id)} ${orderItem.name}`
            )
        );

        return {
            totalItems: currentOrder.items.reduce((sum, item) => sum + item.quantity, 0),
            totalValue: currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            summaryText: summaryParts.join(' • '),
            itemDetails,
            categories: Object.keys(itemsByType)
        };
    }, [currentOrder, menuItems]);

    // Marquee animation effect
    useEffect(() => {
        if (!orderSummary || orderSummary.itemDetails.length === 0) return;

        const interval = setInterval(() => {
            setMarqueePosition(prev => {
                const next = prev + 1;
                const maxPosition = orderSummary.itemDetails.length;
                return next >= maxPosition ? 0 : next;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [orderSummary]);

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
            {/* Enhanced Header with Order Summary */}
            <div className="bg-glass rounded-lg p-2 border border-glass flex flex-col gap-2">
                {/* Top Row - Table Info */}
                <div className="flex justify-between items-center">
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

                {/* Order Summary Marquee */}
                {orderSummary && (
                    <div className="bg-primary/20 rounded-lg p-2 border border-primary/30">
                        <div className="flex items-center justify-between text-xs">
                            {/* Static Summary */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-white font-semibold">
                                    📊 ORDER: {orderSummary.totalItems} items
                                </div>
                                <div className="text-accent font-bold">
                                    €{orderSummary.totalValue.toFixed(2)}
                                </div>
                                <div className="text-gray-300 hidden sm:block">
                                    {orderSummary.summaryText}
                                </div>
                            </div>

                            {/* Sliding Items Marquee */}
                            {orderSummary.itemDetails.length > 0 && (
                                <div className="flex-1 ml-4 overflow-hidden">
                                    <div 
                                        className="flex items-center gap-4 transition-transform duration-1000 ease-in-out"
                                        style={{ transform: `translateX(-${marqueePosition * 120}px)` }}
                                    >
                                        {orderSummary.itemDetails.map((item, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center gap-2 text-gray-300 whitespace-nowrap flex-shrink-0"
                                            >
                                                <span>{item}</span>
                                                {index < orderSummary.itemDetails.length - 1 && (
                                                    <span className="text-primary">•</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Category Pills */}
                        {orderSummary.categories.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                                {orderSummary.categories.map(category => (
                                    <span 
                                        key={category}
                                        className="px-2 py-1 bg-primary/30 rounded-full text-xs text-white border border-primary/50"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Order Display & Menu Container */}
            <div className="bg-glass rounded-lg p-2 border border-glass flex flex-col gap-2 flex-1 overflow-hidden">
                {/* Enhanced Order Display */}
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
                            {currentOrder.items.map((orderItem, index) => (
                                <div
                                    key={`${orderItem.id}-${index}`}
                                    className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border-l-4 border-primary hover:bg-gray-700/50 transition-all duration-150 group"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="text-2xl flex-shrink-0">
                                            {getItemIcon(orderItem.id)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-white font-semibold text-sm truncate">
                                                {orderItem.name}
                                            </div>
                                            <div className="text-gray-400 text-xs flex items-center gap-2">
                                                <span className="capitalize">
                                                    {getItemCategory(orderItem.id)}
                                                </span>
                                                {orderItem.notes && (
                                                    <span className="truncate">• {orderItem.notes}</span>
                                                )}
                                                <span>• VAT {orderItem.vat}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="text-accent font-bold text-sm whitespace-nowrap">
                                            €{(orderItem.price * orderItem.quantity).toFixed(2)}
                                        </div>
                                        <div className="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
                                            <button
                                                onClick={() => onUpdateQuantity(index, -1)}
                                                className="w-6 h-6 rounded bg-gray-600 hover:bg-danger transition-all duration-150 flex items-center justify-center text-white text-sm font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="text-white font-bold text-sm min-w-[20px] text-center">
                                                {orderItem.quantity}
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

                {/* Compact Menu Grid - SORTED BY EATING ORDER */}
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
                            <div className="text-gray-400 text-xs capitalize">
                                {item.category}
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