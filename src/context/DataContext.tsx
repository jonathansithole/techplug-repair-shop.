import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ServiceCategory, Order } from '../../types';
//import { TicketStatus } from '../../types';

interface DataContextProps {
  products: Product[];
  services: ServiceCategory[];
  cart: { id: string; name: string; price: number; quantity: number; image: string }[];
  orders: Order[];
 // tickets: Ticket[];

  // Product functions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart functions
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  placeOrder: (order: Order) => void;
  clearCart: () => void;

  // Service functions
  addServiceCategory: (category: ServiceCategory) => void;
  updateServiceCategory: (id: string, updated: Partial<ServiceCategory>) => void;
  deleteServiceCategory: (id: string) => void;

  // Ticket functions
 // addTicket: (ticket: Ticket) => void;
//  updateTicketStatus: (id: string, status: TicketStatus) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [cart, setCart] = useState<DataContextProps['cart']>([]);
  const [orders, setOrders] = useState<Order[]>([]);
 // const [tickets, setTickets] = useState<Ticket[]>([]);

  // --- Product logic ---
  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  // --- Cart logic ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }];
    });
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);
  const placeOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    clearCart();
  };

  // --- Services logic ---
  const addServiceCategory = (category: ServiceCategory) => setServices(prev => [...prev, category]);
  const updateServiceCategory = (id: string, updated: Partial<ServiceCategory>) => {
    setServices(prev => prev.map(cat => (cat.id === id ? { ...cat, ...updated } : cat)));
  };
  const deleteServiceCategory = (id: string) => setServices(prev => prev.filter(cat => cat.id !== id));

  // --- Tickets logic ---
 // const addTicket = (ticket: Ticket) => setTickets(prev => [...prev, ticket]);
  //const updateTicketStatus = (id: string, status: TicketStatus) => {
  //  setTickets(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  //};

  return (
    <DataContext.Provider value={{
      products,
      services,
      cart,
      orders,
    //  tickets,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      addServiceCategory,
      updateServiceCategory,
      deleteServiceCategory,
     // addTicket,
    //  updateTicketStatus,
    }}>
      {children}
    </DataContext.Provider>
  );
};

// --- Custom hook ---
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
