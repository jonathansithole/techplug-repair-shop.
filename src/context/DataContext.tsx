import { createContext, useContext, useState, ReactNode } from "react";
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  ServiceRequest,
  ServiceCategory
} from "../../types";

/* =========================
   INITIAL SERVICE CATALOG
   ========================= */
const INITIAL_SERVICES: ServiceCategory[] = [
  {
    id: "cat_laptop",
    serviceType: "Laptop Repair",
    description: "Comprehensive diagnostics and repair for all laptop models.",
    services: [
      { id: "srv_l_screen", name: "Screen Replacement", price: 1500, description: "New display installation." },
      { id: "srv_l_bat", name: "Battery Replacement", price: 800, description: "Genuine battery swap." },
      { id: "srv_l_key", name: "Keyboard Replacement", price: 700, description: "Full keyboard unit replacement." },
      { id: "srv_l_mobo", name: "Motherboard Repair", price: 2500, description: "Component-level board repair." },
      { id: "srv_l_soft", name: "Software Troubleshooting", price: 450, description: "OS issues, virus removal." }
    ]
  },
  {
    id: "cat_desktop",
    serviceType: "Desktop PC Repair",
    description: "Upgrades, diagnostics, and repairs for desktops.",
    services: [
      { id: "srv_d_upg", name: "Component Upgrade", price: 600, description: "CPU, RAM, GPU installation." },
      { id: "srv_d_psu", name: "PSU Replacement", price: 900, description: "Power supply unit swap." },
      { id: "srv_d_data", name: "Data Recovery", price: 1200, description: "Recover lost files." }
    ]
  },
  {
    id: "cat_mobile",
    serviceType: "Mobile Device Repair",
    description: "Repairs for smartphones and tablets.",
    services: [
      { id: "srv_m_screen", name: "Phone Screen Repair", price: 1000, description: "Cracked screen replacement." },
      { id: "srv_m_bat", name: "Battery Replacement", price: 750, description: "Battery swap." },
      { id: "srv_m_port", name: "Charging Port Repair", price: 650, description: "Fix charging issues." }
    ]
  }
];

/* =========================
   CONTEXT TYPES
   ========================= */
interface DataContextType {
  // Products & Cart
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => void;

  // Admin: Inventory
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Admin: Tickets
  tickets: ServiceRequest[];

  // Admin: Service Catalog
  services: ServiceCategory[];
  addServiceCategory: (category: ServiceCategory) => void;
  updateServiceCategory: (id: string, updates: Partial<ServiceCategory>) => void;
  deleteServiceCategory: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/* =========================
   PROVIDER
   ========================= */
export const DataProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets] = useState<ServiceRequest[]>([]); // fetched later via API
  const [services, setServices] = useState<ServiceCategory[]>(INITIAL_SERVICES);

  /* ---------- CART ---------- */
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  /* ---------- ORDERS ---------- */
  const placeOrder = (orderData: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: OrderStatus.PENDING
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  /* ---------- PRODUCTS ---------- */
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  /* ---------- SERVICES ---------- */
  const addServiceCategory = (category: ServiceCategory) => {
    setServices(prev => [...prev, category]);
  };

  const updateServiceCategory = (id: string, updates: Partial<ServiceCategory>) => {
    setServices(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteServiceCategory = (id: string) => {
    setServices(prev => prev.filter(cat => cat.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/* =========================
   HOOK
   ========================= */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
