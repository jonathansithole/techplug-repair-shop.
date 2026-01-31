import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order, Ticket, OrderStatus, ServiceCategory } from '../../types';

// --- INITIAL SERVICE DATA ---
const INITIAL_SERVICES: ServiceCategory[] = [
    {
        id: 'cat_laptop',
        category: "Laptop Repair",
        description: "Comprehensive diagnostics and repair for all laptop models.",
        services: [
            { id: 'srv_l_screen', name: "Screen Replacement", price: 1500, description: "New display installation." },
            { id: 'srv_l_bat', name: "Battery Replacement", price: 800, description: "Genuine battery swap." },
            { id: 'srv_l_key', name: "Keyboard Replacement", price: 700, description: "Full keyboard unit replacement." },
            { id: 'srv_l_mobo', name: "Motherboard Repair", price: 2500, description: "Component-level board repair." },
            { id: 'srv_l_soft', name: "Software Troubleshooting", price: 450, description: "OS issues, virus removal." },
        ]
    },
    {
        id: 'cat_desktop',
        category: "Desktop PC Repair",
        description: "Upgrades, diagnostics, and repairs for custom and brand-name desktops.",
        services: [
            { id: 'srv_d_upg', name: "Component Upgrade", price: 600, description: "CPU, RAM, GPU installation." },
            { id: 'srv_d_psu', name: "PSU Replacement", price: 900, description: "Power supply unit swap." },
            { id: 'srv_d_data', name: "Data Recovery", price: 1200, description: "Recover lost files from drives." },
            { id: 'srv_d_build', name: "Custom Build Consultation", price: 300, description: "Expert advice for new builds." },
        ]
    },
    {
        id: 'cat_mobile',
        category: "Mobile Device Repair",
        description: "Screen, battery, and component repairs for smartphones and tablets.",
        services: [
            { id: 'srv_m_screen', name: "Phone Screen Repair", price: 1000, description: "Cracked screen replacement." },
            { id: 'srv_m_bat', name: "Tablet Battery Replacement", price: 750, description: "Tablet battery swap." },
            { id: 'srv_m_port', name: "Charging Port Repair", price: 650, description: "Fix non-charging ports." },
        ]
    },
    {
        id: 'cat_data',
        category: "Data Recovery",
        description: "Professional data retrieval from damaged hard drives and storage devices.",
        services: [
            { id: 'srv_dr_std', name: "Standard Data Recovery", price: 1800, description: "From non-booting drives." },
            { id: 'srv_dr_adv', name: "Advanced Data Recovery", price: 3500, description: "From physically damaged drives." },
        ]
    }
];

interface DataContextType {
    // Products & Cart
    products: Product[];
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    
    // Orders
    orders: Order[];
    placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
    
    // Admin: Inventory
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;

    // Admin: Tickets (Existing)
    tickets: Ticket[];

    // Admin: Services (New)
    services: ServiceCategory[];
    addServiceCategory: (category: ServiceCategory) => void;
    updateServiceCategory: (id: string, updates: Partial<ServiceCategory>) => void;
    deleteServiceCategory: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- STATE ---
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]); // Placeholder for now
    const [services, setServices] = useState<ServiceCategory[]>(INITIAL_SERVICES);

    // --- CART ACTIONS ---
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    // --- ORDER ACTIONS ---
    const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
        const newOrder: Order = {
            ...orderData,
            id: `ORD-${Date.now()}`,
            date: new Date().toISOString(),
            status: OrderStatus.PENDING
        };
        setOrders(prev => [newOrder, ...prev]);
        setCart([]); // Clear cart
    };

    // --- PRODUCT ACTIONS ---
    const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
    
    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };
    
    const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

    // --- SERVICE ACTIONS ---
    const addServiceCategory = (category: ServiceCategory) => {
        setServices(prev => [...prev, category]);
    };

    const updateServiceCategory = (id: string, updates: Partial<ServiceCategory>) => {
        setServices(prev => prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
    };

    const deleteServiceCategory = (id: string) => {
        setServices(prev => prev.filter(cat => cat.id !== id));
    };

    return (
        <DataContext.Provider value={{ 
            products, 
            cart, 
            addToCart, 
            removeFromCart, 
            orders, 
            placeOrder, 
            addProduct, 
            updateProduct, 
            deleteProduct,
            tickets,
            services,
            addServiceCategory,
            updateServiceCategory,
            deleteServiceCategory
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within DataProvider");
    return context;
};