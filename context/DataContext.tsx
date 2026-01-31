import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order, Ticket, OrderStatus, ServiceCategory } from '../types';

// --- INITIAL SERVICE DATA (Updated with your list) ---
const INITIAL_SERVICES: ServiceCategory[] = [
    {
        id: 'cat_software',
        category: "Software Services",
        description: "Installations, troubleshooting, and system optimizations.",
        services: [
            { id: 'sw_win_inst', name: "Windows Installation", price: 200, description: "Any version (10/11)." },
            { id: 'sw_win_reinst', name: "Windows Reinstallation", price: 350, description: "Includes data backup." },
            { id: 'sw_win_act', name: "Windows Activation", price: 80, description: "License activation service." },
            { id: 'sw_office', name: "Microsoft Office Install", price: 100, description: "Word, Excel, PowerPoint, Outlook." },
            { id: 'sw_other', name: "Other Software Install", price: 100, description: "Antivirus, design tools, etc. (From R100)" },
            { id: 'sw_bsod', name: "Blue/Black Screen Fix", price: 200, description: "Error troubleshooting." },
            { id: 'sw_file_rec', name: "File Recovery", price: 250, description: "Deleted files, formatted drives. (From R250)" },
            { id: 'sw_virus', name: "Virus & Malware Removal", price: 200, description: "Clean up infected systems." },
            { id: 'sw_drivers', name: "Driver Install & Updates", price: 150, description: "System driver configuration." },
            { id: 'sw_opt', name: "System Optimization", price: 200, description: "Speed boost, cleanup, startup fix." },
            { id: 'sw_print', name: "Printer/Peripheral Setup", price: 150, description: "Setup & driver installation." },
            { id: 'sw_pass', name: "Password Reset", price: 150, description: "Account unlock service." },
            { id: 'sw_net', name: "Network & Sharing Setup", price: 200, description: "Wi-Fi, LAN, printers. (From R200)" },
            { id: 'sw_remote', name: "Remote Support", price: 150, description: "AnyDesk/TeamViewer per session." },
        ]
    },
    {
        id: 'cat_hardware',
        category: "Hardware Services",
        description: "Repairs, replacements, and upgrades for physical components.",
        services: [
            { id: 'hw_ram', name: "RAM Upgrade", price: 200, description: "Memory replacement/upgrade. (From R200)" },
            { id: 'hw_hdd', name: "Hard Drive Replacement", price: 450, description: "Storage upgrade/swap. (From R450)" },
            { id: 'hw_ssd', name: "SSD Upgrade", price: 600, description: "Speed upgrade. (From R600)" },
            { id: 'hw_charger', name: "Charger Replacement", price: 250, description: "Laptop charger replacement. (From R250)" },
            { id: 'hw_bat', name: "Battery Replacement", price: 500, description: "Laptop battery swap. (From R500)" },
            { id: 'hw_screen', name: "Screen Replacement", price: 700, description: "Laptop/Monitor. (From R700)" },
            { id: 'hw_key', name: "Keyboard Replacement", price: 300, description: "Laptop keyboard. (From R300)" },
            { id: 'hw_touch', name: "Touchpad Replacement", price: 300, description: "Trackpad fix. (From R300)" },
            { id: 'hw_mobo', name: "Motherboard Repair", price: 800, description: "Repair or replacement. (From R800)" },
            { id: 'hw_psu', name: "PSU Replacement", price: 450, description: "Power Supply Unit. (From R450)" },
            { id: 'hw_fan', name: "Cooling Fan Repair", price: 300, description: "Overheating fix. (From R300)" },
            { id: 'hw_usb', name: "USB Port Repair", price: 300, description: "Port replacement. (From R300)" },
            { id: 'hw_hinge', name: "Hinge Repair", price: 350, description: "Laptop casing/hinge fix. (From R350)" },
            { id: 'hw_gpu', name: "GPU Replacement", price: 600, description: "Graphics card upgrade. (From R600)" },
            { id: 'hw_diag', name: "Hardware Diagnostics", price: 300, description: "General troubleshooting. (From R300)" },
        ]
    },
    {
        id: 'cat_security',
        category: "Data & Security",
        description: "Backups, recovery, and secure data handling.",
        services: [
            { id: 'ds_backup', name: "Data Backup Setup", price: 200, description: "Cloud or external drive. (From R200)" },
            { id: 'ds_full_back', name: "Full System Backup", price: 350, description: "Backup & Restore. (From R350)" },
            { id: 'ds_rec_hdd', name: "Hard Drive Data Recovery", price: 500, description: "Corrupted drive recovery. (From R500)" },
            { id: 'ds_part', name: "Partition Management", price: 200, description: "Drive formatting/partitioning. (From R200)" },
            { id: 'ds_trans', name: "Data Transfer", price: 250, description: "Old PC to New PC. (From R250)" },
        ]
    },
    {
        id: 'cat_custom',
        category: "Custom Services",
        description: "Specialized diagnostics and on-site support.",
        services: [
            { id: 'cs_opt', name: "PC Performance Tune-up", price: 200, description: "Full optimization." },
            { id: 'cs_diag', name: "Full Diagnostics", price: 200, description: "Hardware & Software check." },
            { id: 'cs_visit', name: "On-Site Technician", price: 150, description: "Call-out fee per visit." },
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
    const [tickets, setTickets] = useState<Ticket[]>([]); 
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