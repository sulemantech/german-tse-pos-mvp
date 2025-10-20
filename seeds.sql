USE [pos_mvp]
GO

-- 1. CLEAR EXISTING DATA (if needed)
/*
DELETE FROM SYSTEM_EVENT_LOG
DELETE FROM CASH_DRAWER_MOVEMENTS
DELETE FROM TSE_LOG
DELETE FROM PAYMENT_DETAILS
DELETE FROM RECEIPT_LINE_ITEM
DELETE FROM RECEIPT_ORDER_MAPPING
DELETE FROM RECEIPT_HEADER
DELETE FROM ORDER_ITEMS
DELETE FROM ORDER_HEADER
DELETE FROM MENU_ITEMS
DELETE FROM RESTAURANT_TABLES
DELETE FROM STAFF_USERS
DELETE FROM TSE_UNITS
DELETE FROM POS_REGISTERS
DELETE FROM VAT_RATES
*/
GO

-- 2. MASTER DATA (insert in dependency order)

-- VAT Rates first (no dependencies)
INSERT INTO VAT_RATES (VAT_ID, RATE, DESCRIPTION) VALUES
(1, 19.00, 'Standard VAT Rate - General goods and services'),
(2, 7.00, 'Reduced VAT Rate - Food, books, newspapers'),
(5, 0.00, 'Tax Free - Exports, international services'),
(3, 10.70, 'Average rate for restaurants'),
(4, 5.50, 'Average rate for accommodations');
GO

-- Staff Users (no dependencies)
INSERT INTO STAFF_USERS (USER_ID, USER_PIN_HASH, FIRST_NAME, LAST_NAME, ROLE, IS_ACTIVE) VALUES
('ADMIN', '$2a$10$ExampleHashForAdmin123', 'Max', 'Mustermann', 'Admin', 1),
('WAITER_01', '$2a$10$ExampleHashForWaiter1', 'Anna', 'Schmidt', 'Waiter', 1),
('WAITER_02', '$2a$10$ExampleHashForWaiter2', 'Thomas', 'Müller', 'Waiter', 1),
('WAITER_03', '$2a$10$ExampleHashForWaiter3', 'Sarah', 'Weber', 'Waiter', 1),
('CHEF_01', '$2a$10$ExampleHashForChef1', 'Klaus', 'Fischer', 'Chef', 1),
('MANAGER_01', '$2a$10$ExampleHashForManager1', 'Julia', 'Bauer', 'Manager', 1),
('BAR_01', '$2a$10$ExampleHashForBar1', 'Marco', 'Hoffmann', 'Bartender', 1);
GO

-- POS Registers (no dependencies)
INSERT INTO POS_REGISTERS (REGISTER_SERIAL_NUMBER, LOCATION_ID) VALUES
('POS-001', 'MAIN_ROOM'),
('POS-002', 'TERRACE'),
('POS-003', 'BAR'),
('POS-004', 'TAKEAWAY');
GO

-- TSE Units (no dependencies)
INSERT INTO TSE_UNITS (TSE_SERIAL_NUMBER, PUBLIC_KEY, CERTIFICATE_VALID_UNTIL) VALUES
('TSE-001-DE-2024', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAExamplePublicKey123456789', '2026-12-31 23:59:59 +01:00'),
('TSE-002-DE-2024', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAAnotherPublicKey987654321', '2026-12-31 23:59:59 +01:00');
GO

-- Restaurant Tables (no dependencies)
INSERT INTO RESTAURANT_TABLES (TABLE_ID, TABLE_NAME, LOCATION_ID) VALUES
('TABLE_01', 'Window 1', 'MAIN_ROOM'),
('TABLE_02', 'Window 2', 'MAIN_ROOM'),
('TABLE_03', 'Middle Left', 'MAIN_ROOM'),
('TABLE_04', 'Middle Right', 'MAIN_ROOM'),
('TABLE_05', 'Near Counter', 'MAIN_ROOM'),
('TABLE_06', 'Corner', 'MAIN_ROOM'),
('TABLE_11', 'Terrace 1', 'TERRACE'),
('TABLE_12', 'Terrace 2', 'TERRACE'),
('TABLE_13', 'Terrace 3', 'TERRACE'),
('BAR_01', 'Bar Seat 1', 'BAR'),
('BAR_02', 'Bar Seat 2', 'BAR'),
('TAKE_01', 'Takeaway 1', 'TAKEAWAY'),
('TAKE_02', 'Takeaway 2', 'TAKEAWAY');
GO

-- Menu Items (depends on VAT_RATES)
INSERT INTO MENU_ITEMS (ITEM_ID, ITEM_NAME, ITEM_GROUP, VAT_ID, BASE_PRICE, IS_ACTIVE) VALUES
-- Drinks - Non-alcoholic
('DRINK_WATER', 'Mineral Water 0.5L', 'Drinks', 2, 3.50, 1),
('DRINK_WATER_1L', 'Mineral Water 1.0L', 'Drinks', 2, 5.50, 1),
('DRINK_COLA', 'Cola 0.33L', 'Drinks', 2, 3.80, 1),
('DRINK_FANTA', 'Fanta 0.33L', 'Drinks', 2, 3.80, 1),
('DRINK_SPRITE', 'Sprite 0.33L', 'Drinks', 2, 3.80, 1),
('DRINK_APPLE_JUICE', 'Apple Juice 0.2L', 'Drinks', 2, 3.20, 1),
('DRINK_ORANGE_JUICE', 'Orange Juice 0.2L', 'Drinks', 2, 3.20, 1),
('DRINK_TEA', 'Various Teas', 'Drinks', 2, 2.80, 1),
('DRINK_COFFEE', 'Coffee', 'Drinks', 2, 3.00, 1),
('DRINK_CAPPUCCINO', 'Cappuccino', 'Drinks', 2, 3.80, 1),
('DRINK_ESPRESSO', 'Espresso', 'Drinks', 2, 2.50, 1),

-- Drinks - Beer
('DRINK_BEER_05', 'Pilsner 0.5L', 'Drinks', 2, 4.80, 1),
('DRINK_BEER_03', 'Pilsner 0.3L', 'Drinks', 2, 3.80, 1),
('DRINK_WHEAT_05', 'Wheat Beer 0.5L', 'Drinks', 2, 5.20, 1),
('DRINK_WHEAT_03', 'Wheat Beer 0.3L', 'Drinks', 2, 4.20, 1),
('DRINK_RADLER', 'Shandy 0.5L', 'Drinks', 2, 4.90, 1),

-- Drinks - Wine
('DRINK_WHITE_02', 'White Wine 0.2L', 'Drinks', 2, 5.50, 1),
('DRINK_WHITE_GLASS', 'White Wine Glass', 'Drinks', 2, 4.50, 1),
('DRINK_RED_02', 'Red Wine 0.2L', 'Drinks', 2, 5.50, 1),
('DRINK_RED_GLASS', 'Red Wine Glass', 'Drinks', 2, 4.50, 1),
('DRINK_PROSECCO', 'Prosecco Glass', 'Drinks', 2, 5.80, 1),
('DRINK_SPARKLING', 'Sparkling Wine Glass', 'Drinks', 2, 5.20, 1),

-- Drinks - Spirits
('DRINK_WHISKY', 'Whisky 2cl', 'Drinks', 2, 6.50, 1),
('DRINK_VODKA', 'Vodka 2cl', 'Drinks', 2, 5.80, 1),
('DRINK_GIN', 'Gin 2cl', 'Drinks', 2, 6.20, 1),
('DRINK_RUM', 'Rum 2cl', 'Drinks', 2, 5.90, 1),

-- Appetizers
('APP_SALAD', 'Mixed Salad', 'Appetizers', 1, 8.50, 1),
('APP_TOMATO_MOZZ', 'Tomato Mozzarella', 'Appetizers', 1, 9.80, 1),
('APP_SOUP_DAY', 'Soup of the Day', 'Appetizers', 1, 5.50, 1),
('APP_ONION_SOUP', 'French Onion Soup', 'Appetizers', 1, 6.80, 1),
('APP_BUFFALO_WINGS', 'Buffalo Wings', 'Appetizers', 1, 12.50, 1),

-- Main Courses
('MAIN_SCHNITZEL', 'Wiener Schnitzel with Fries', 'Main Courses', 1, 18.90, 1),
('MAIN_STEAK', 'Rump Steak with Herb Butter', 'Main Courses', 1, 24.90, 1),
('MAIN_BURGER', 'Homemade Burger', 'Main Courses', 1, 16.50, 1),
('MAIN_PASTA', 'Spaghetti Carbonara', 'Main Courses', 1, 14.80, 1),
('MAIN_PIZZA', 'Pizza Margherita', 'Main Courses', 1, 12.90, 1),
('MAIN_SALMON', 'Salmon Fillet with Vegetables', 'Main Courses', 1, 22.50, 1),
('MAIN_RIBS', 'Barbecue Ribs', 'Main Courses', 1, 19.80, 1),
('MAIN_CURRY', 'Chicken Curry', 'Main Courses', 1, 15.90, 1),
('MAIN_VEGGIE', 'Vegetable Stir Fry', 'Main Courses', 1, 13.50, 1),

-- Side Dishes
('SIDE_FRIES', 'French Fries', 'Side Dishes', 1, 3.50, 1),
('SIDE_POTATOES', 'Fried Potatoes', 'Side Dishes', 1, 4.20, 1),
('SIDE_SALAD', 'Side Salad', 'Side Dishes', 1, 3.80, 1),
('SIDE_VEGETABLES', 'Seasonal Vegetables', 'Side Dishes', 1, 4.50, 1),

-- Desserts
('DESSERT_ICE', 'Ice Cream Sundae', 'Desserts', 1, 6.50, 1),
('DESSERT_CAKE', 'Cake of the Day', 'Desserts', 1, 4.80, 1),
('DESSERT_TIRAMISU', 'Tiramisu', 'Desserts', 1, 5.90, 1),
('DESSERT_CREME', 'Crème Brûlée', 'Desserts', 1, 6.80, 1),

-- Special Offers
('SPECIAL_MENU', 'Daily Menu', 'Special Offers', 1, 15.90, 1),
('SPECIAL_BUSINESS', 'Business Lunch', 'Special Offers', 1, 12.50, 1),
('SPECIAL_KIDS', 'Kids Menu', 'Special Offers', 1, 8.90, 1);
GO

-- 3. ORDER DATA (depends on STAFF_USERS, RESTAURANT_TABLES)

-- Order Headers
INSERT INTO ORDER_HEADER (ORDER_ID, TABLE_ID, STAFF_USER_ID, ORDER_STATUS, ORDER_OPEN_TIME, ORDER_CLOSE_TIME, GUEST_COUNT) VALUES
-- Open Orders
('ORDER_20251020_001', 'TABLE_01', 'WAITER_01', 'OPEN', '2025-10-20 12:30:00 +01:00', NULL, 2),
('ORDER_20251020_002', 'TABLE_11', 'WAITER_02', 'OPEN', '2025-10-20 13:15:00 +01:00', NULL, 4),
('ORDER_20251020_003', 'BAR_01', 'BAR_01', 'OPEN', '2025-10-20 14:00:00 +01:00', NULL, 1),
('ORDER_20251020_004', 'TAKE_01', 'WAITER_03', 'OPEN', '2025-10-20 18:30:00 +01:00', NULL, NULL),

-- Closed Orders (for testing receipts)
('ORDER_20251019_001', 'TABLE_03', 'WAITER_01', 'CLOSED', '2025-10-19 19:30:00 +01:00', '2025-10-19 21:15:00 +01:00', 3),
('ORDER_20251019_002', 'TABLE_05', 'WAITER_03', 'CLOSED', '2025-10-19 20:00:00 +01:00', '2025-10-19 22:00:00 +01:00', 2),
('ORDER_20251018_001', 'TABLE_12', 'WAITER_02', 'CLOSED', '2025-10-18 13:00:00 +01:00', '2025-10-18 14:30:00 +01:00', 5),
('ORDER_20251018_002', 'TAKE_01', 'WAITER_01', 'CLOSED', '2025-10-18 18:45:00 +01:00', '2025-10-18 19:15:00 +01:00', NULL);
GO

-- Order Items (depends on ORDER_HEADER, MENU_ITEMS, VAT_RATES)
INSERT INTO ORDER_ITEMS (ORDER_ID, ORDER_LINE_NUMBER, MENU_ITEM_ID, QUANTITY, UNIT_PRICE, VAT_ID, NOTES) VALUES
-- Current open order - Table 1 (2 guests, lunch)
('ORDER_20251020_001', 1, 'DRINK_WATER', 2.000, 3.50, 2, 'No gas'),
('ORDER_20251020_001', 2, 'DRINK_BEER_05', 2.000, 4.80, 2, NULL),
('ORDER_20251020_001', 3, 'MAIN_SCHNITZEL', 1.000, 18.90, 1, 'With lemon'),
('ORDER_20251020_001', 4, 'MAIN_BURGER', 1.000, 16.50, 1, 'No onions'),
('ORDER_20251020_001', 5, 'SIDE_FRIES', 2.000, 3.50, 1, NULL),

-- Terrace order - Table 11 (4 guests)
('ORDER_20251020_002', 1, 'DRINK_WATER_1L', 1.000, 5.50, 2, NULL),
('ORDER_20251020_002', 2, 'DRINK_BEER_05', 3.000, 4.80, 2, NULL),
('ORDER_20251020_002', 3, 'DRINK_RADLER', 1.000, 4.90, 2, NULL),
('ORDER_20251020_002', 4, 'MAIN_PIZZA', 2.000, 12.90, 1, 'One extra cheese'),
('ORDER_20251020_002', 5, 'MAIN_PASTA', 1.000, 14.80, 1, NULL),
('ORDER_20251020_002', 6, 'MAIN_SALMON', 1.000, 22.50, 1, 'Well done'),
('ORDER_20251020_002', 7, 'DESSERT_ICE', 2.000, 6.50, 1, NULL),

-- Bar order - Single guest
('ORDER_20251020_003', 1, 'DRINK_WHISKY', 2.000, 6.50, 2, 'With ice'),
('ORDER_20251020_003', 2, 'DRINK_BEER_03', 1.000, 3.80, 2, NULL),

-- Takeaway order
('ORDER_20251020_004', 1, 'MAIN_BURGER', 2.000, 16.50, 1, 'Takeaway'),
('ORDER_20251020_004', 2, 'SIDE_FRIES', 2.000, 3.50, 1, 'Extra crispy'),
('ORDER_20251020_004', 3, 'DRINK_COLA', 2.000, 3.80, 2, NULL),

-- Historical closed orders for reporting
('ORDER_20251019_001', 1, 'DRINK_RED_GLASS', 3.000, 4.50, 2, NULL),
('ORDER_20251019_001', 2, 'DRINK_WHITE_GLASS', 2.000, 4.50, 2, NULL),
('ORDER_20251019_001', 3, 'MAIN_STEAK', 2.000, 24.90, 1, 'Medium rare'),
('ORDER_20251019_001', 4, 'MAIN_VEGGIE', 1.000, 13.50, 1, 'Vegan'),
('ORDER_20251019_001', 5, 'DESSERT_TIRAMISU', 2.000, 5.90, 1, NULL),

('ORDER_20251019_002', 1, 'DRINK_PROSECCO', 2.000, 5.80, 2, NULL),
('ORDER_20251019_002', 2, 'APP_SALAD', 2.000, 8.50, 1, NULL),
('ORDER_20251019_002', 3, 'MAIN_RIBS', 2.000, 19.80, 1, 'Extra sauce'),
('ORDER_20251019_002', 4, 'DESSERT_CREME', 2.000, 6.80, 1, NULL);
GO

-- 4. RECEIPT DATA (for closed orders only)

-- Receipt Headers (depends on POS_REGISTERS, STAFF_USERS)
INSERT INTO RECEIPT_HEADER (
    RECEIPT_ID, REGISTER_SERIAL_NUMBER, STAFF_USER_ID, START_TIME,
    TOTAL_AMOUNT, TOTAL_NET_AMOUNT, TOTAL_VAT_AMOUNT,
    PROCESS_TYPE, RECEIPT_TYPE, ORIGINAL_RECEIPT_ID
) VALUES
-- Receipt for ORDER_20251019_001
('RECEIPT_20251019_001', 'POS-001', 'WAITER_01', '2025-10-19 21:15:00 +01:00', 
 115.60, 100.00, 15.60, 'Kassenbeleg-V1', 'Beleg', NULL),

-- Receipt for ORDER_20251019_002  
('RECEIPT_20251019_002', 'POS-001', 'WAITER_03', '2025-10-19 22:00:00 +01:00',
 81.40, 70.00, 11.40, 'Kassenbeleg-V1', 'Beleg', NULL),

-- Receipt for takeaway order
('RECEIPT_20251018_002', 'POS-004', 'WAITER_01', '2025-10-18 19:15:00 +01:00',
 47.60, 40.00, 7.60, 'Kassenbeleg-V1', 'Beleg', NULL);
GO

-- Receipt Line Items (depends on RECEIPT_HEADER, VAT_RATES, MENU_ITEMS)
INSERT INTO RECEIPT_LINE_ITEM (RECEIPT_ID, LINE_NUMBER, VAT_ID, QUANTITY, UNIT_PRICE, ITEM_NAME, MENU_ITEM_ID) VALUES
-- Receipt 1 items
('RECEIPT_20251019_001', 1, 2, 3.000, 4.50, 'Red Wine Glass', 'DRINK_RED_GLASS'),
('RECEIPT_20251019_001', 2, 2, 2.000, 4.50, 'White Wine Glass', 'DRINK_WHITE_GLASS'),
('RECEIPT_20251019_001', 3, 1, 2.000, 24.90, 'Rump Steak with Herb Butter', 'MAIN_STEAK'),
('RECEIPT_20251019_001', 4, 1, 1.000, 13.50, 'Vegetable Stir Fry', 'MAIN_VEGGIE'),
('RECEIPT_20251019_001', 5, 1, 2.000, 5.90, 'Tiramisu', 'DESSERT_TIRAMISU'),

-- Receipt 2 items
('RECEIPT_20251019_002', 1, 2, 2.000, 5.80, 'Prosecco Glass', 'DRINK_PROSECCO'),
('RECEIPT_20251019_002', 2, 1, 2.000, 8.50, 'Mixed Salad', 'APP_SALAD'),
('RECEIPT_20251019_002', 3, 1, 2.000, 19.80, 'Barbecue Ribs', 'MAIN_RIBS'),
('RECEIPT_20251019_002', 4, 1, 2.000, 6.80, 'Crème Brûlée', 'DESSERT_CREME');
GO

-- Payment Details (depends on RECEIPT_HEADER)
INSERT INTO PAYMENT_DETAILS (RECEIPT_ID, PAYMENT_METHOD, PAID_AMOUNT) VALUES
('RECEIPT_20251019_001', 'Cash', 115.60),
('RECEIPT_20251019_002', 'Credit Card', 81.40),
('RECEIPT_20251018_002', 'Cash', 47.60);
GO

-- TSE Log (depends on RECEIPT_HEADER, TSE_UNITS)
INSERT INTO TSE_LOG (RECEIPT_ID, TSE_SERIAL_NUMBER, SIGNATURE_COUNTER, SIGNATURE_VALUE, LOG_TIME) VALUES
('RECEIPT_20251019_001', 'TSE-001-DE-2024', 1001, 'TSE_SIGNATURE_ABC123XYZ456', '2025-10-19 21:15:05 +01:00'),
('RECEIPT_20251019_002', 'TSE-001-DE-2024', 1002, 'TSE_SIGNATURE_DEF456UVW789', '2025-10-19 22:00:10 +01:00'),
('RECEIPT_20251018_002', 'TSE-001-DE-2024', 1003, 'TSE_SIGNATURE_GHI789RST012', '2025-10-18 19:15:08 +01:00');
GO

-- Receipt-Order Mapping (depends on RECEIPT_HEADER, ORDER_HEADER)
INSERT INTO RECEIPT_ORDER_MAPPING (RECEIPT_ID, ORDER_ID) VALUES
('RECEIPT_20251019_001', 'ORDER_20251019_001'),
('RECEIPT_20251019_002', 'ORDER_20251019_002'),
('RECEIPT_20251018_002', 'ORDER_20251018_002');
GO

-- 5. CASH MANAGEMENT AND AUDIT DATA

-- Cash Drawer Movements (depends on POS_REGISTERS, STAFF_USERS)
INSERT INTO CASH_DRAWER_MOVEMENTS (REGISTER_SERIAL_NUMBER, STAFF_USER_ID, MOVEMENT_TYPE, AMOUNT, REASON, TIMESTAMP) VALUES
('POS-001', 'MANAGER_01', 'START', 100.00, 'Starting cash', '2025-10-20 08:00:00 +01:00'),
('POS-001', 'WAITER_01', 'MANUAL_IN', 50.00, 'Change replenishment', '2025-10-20 12:00:00 +01:00'),
('POS-001', 'WAITER_03', 'MANUAL_OUT', 20.00, 'Paid delivery driver', '2025-10-20 15:30:00 +01:00'),
('POS-002', 'MANAGER_01', 'START', 80.00, 'Terrace register start', '2025-10-20 09:00:00 +01:00');
GO

-- System Event Log (depends on POS_REGISTERS, STAFF_USERS, RECEIPT_HEADER)
INSERT INTO SYSTEM_EVENT_LOG (EVENT_TIMESTAMP, REGISTER_SERIAL_NUMBER, STAFF_USER_ID, EVENT_TYPE, EVENT_DESCRIPTION, RELATED_RECEIPT_ID) VALUES
('2025-10-20 08:00:00 +01:00', 'POS-001', 'MANAGER_01', 'SYSTEM_START', 'POS system started', NULL),
('2025-10-20 08:01:00 +01:00', 'POS-001', 'MANAGER_01', 'USER_LOGIN', 'Manager logged in', NULL),
('2025-10-20 12:30:00 +01:00', 'POS-001', 'WAITER_01', 'ORDER_CREATED', 'New order created for Table 1', NULL),
('2025-10-20 21:15:05 +01:00', 'POS-001', 'WAITER_01', 'RECEIPT_CREATED', 'Receipt signed with TSE', 'RECEIPT_20251019_001'),
('2025-10-20 22:00:10 +01:00', 'POS-001', 'WAITER_03', 'RECEIPT_CREATED', 'Receipt signed with TSE', 'RECEIPT_20251019_002');
GO

-- 6. CLOSING REPORTS (depends on POS_REGISTERS, STAFF_USERS, TSE_UNITS)
INSERT INTO CLOSING_REPORT (
    Z_REPORT_ID, REGISTER_SERIAL_NUMBER, DATE_TIME, TOTAL_REVENUE,
    STAFF_USER_ID, START_CASH, EXPECTED_CASH, COUNTED_CASH, CASH_DIFFERENCE,
    VAT_TOTAL_19, VAT_TOTAL_7, TOTAL_NET_AMOUNT, TOTAL_GROSS_AMOUNT,
    TSE_SERIAL_NUMBER, TSE_SIGNATURE_COUNTER_START, TSE_SIGNATURE_COUNTER_END
) VALUES
(20251019, 'POS-001', '2025-10-19 23:59:00 +01:00', 197.00,
 'MANAGER_01', 100.00, 297.00, 297.50, 0.50,
 27.00, 12.50, 170.00, 197.00,
 'TSE-001-DE-2024', 1000, 1002),
 
(20251018, 'POS-001', '2025-10-18 23:59:00 +01:00', 145.60,
 'MANAGER_01', 100.00, 245.60, 245.60, 0.00,
 18.50, 8.20, 125.00, 145.60,
 'TSE-001-DE-2024', 998, 1003);
GO

PRINT 'All test data loaded successfully!';
PRINT 'Summary:';
PRINT '- 7 Staff Users';
PRINT '- 4 POS Registers';
PRINT '- 13 Restaurant Tables';
PRINT '- 45 Menu Items';
PRINT '- 8 Orders (4 open, 4 closed)';
PRINT '- 3 Receipts with TSE signatures';
PRINT '- Complete audit trail and cash management data';