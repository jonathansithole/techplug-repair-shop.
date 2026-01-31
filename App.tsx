import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataProvider, useData } from './context/DataContext';
import { Icons } from './components/Icons';
import { TicketStatus, Product, ServiceCategory, ServiceItem } from './types';

// --- SHARED UTILS ---
const formatCurrency = (amount: number) => `R${amount.toLocaleString('en-ZA')}`;

const sendWhatsAppMessage = (message: string) => {
    const phone = "27633675620";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        // Offset for the fixed header
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};

// --- COMPONENTS ---

// 1. Cart Drawer & Checkout
const CartDrawer: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, placeOrder } = useData();
    const [step, setStep] = useState(1); 
    const [shipping, setShipping] = useState({ name: '', email: '', address: '', city: '' });
    const [isLoading, setIsLoading] = useState(false);

    const total = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

    useEffect(() => { if (!isOpen) setStep(1); }, [isOpen]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            placeOrder({
                customerName: shipping.name,
                email: shipping.email,
                address: `${shipping.address}, ${shipping.city}`,
                items: cart,
                total: total,
                paymentMethod: 'Stripe'
            });
            setStep(4);
        } catch (error) {
            console.error("Order placement failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-hidden font-sans text-slate-900">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}
                    />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col"
                    >
                        <div className="px-6 py-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
                            <h2 className="text-xl font-bold tracking-wide">
                                {step === 1 && "Your Basket"}
                                {step === 2 && "Shipping Details"}
                                {step === 3 && "Confirm Order"}
                                {step === 4 && "Order Confirmed!"}
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-teal-400 p-1 rounded-full"><Icons.X className="w-5 h-5"/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
                            {step === 1 && (
                                <ul className="space-y-4">
                                    {cart.length === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-20 text-slate-400"
                                        >
                                            <Icons.ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg">Your cart is feeling a bit light.</p>
                                        </motion.div>
                                    ) : (
                                        cart.map((item) => (
                                            <motion.li 
                                                key={item.id} 
                                                layout
                                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center"
                                            >
                                                <img src={item.image} alt={item.name} className="h-16 w-16 object-contain rounded-lg bg-slate-100 p-1" />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                                                    <p className="text-teal-600 font-bold text-sm">{formatCurrency(item.price)} x {item.quantity}</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-full"><Icons.Trash className="w-4 h-4" /></button>
                                            </motion.li>
                                        ))
                                    )}
                                </ul>
                            )}
                            {step === 2 && (
                                <div className="space-y-4">
                                     <input placeholder="Name" className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-teal-500" onChange={e => setShipping({...shipping, name: e.target.value})} />
                                     <input placeholder="Email" className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-teal-500" onChange={e => setShipping({...shipping, email: e.target.value})} />
                                     <input placeholder="Address" className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-teal-500" onChange={e => setShipping({...shipping, address: e.target.value})} />
                                     <input placeholder="City" className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:border-teal-500" onChange={e => setShipping({...shipping, city: e.target.value})} />
                                </div>
                            )}
                            {step === 3 && <div className="p-6 bg-slate-100 rounded-xl font-bold text-slate-900 text-center text-xl">Total: {formatCurrency(total)}</div>}
                            {step === 4 && <div className="text-center text-teal-500 font-bold text-xl">Success!</div>}
                        </div>

                        {step < 4 && cart.length > 0 && (
                            <div className="p-6 border-t border-slate-100 bg-white">
                                <button 
                                    onClick={() => step === 3 ? handlePlaceOrder() : setStep(step + 1)}
                                    className="w-full bg-teal-500 text-white py-4 rounded-xl font-bold hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all"
                                >
                                    {step === 3 ? 'Pay Now' : 'Next'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// 2. Navbar (Fixed & Glassmorphism)
const Navbar: React.FC<{ activeSection: string, setActiveSection: (v: string) => void, openCart: () => void }> = ({ activeSection, setActiveSection, openCart }) => {
    const { cart } = useData();
    const count = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavClick = (nav: string) => {
        setActiveSection(nav);
        scrollToSection(nav);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 inset-x-0 z-[90] h-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto w-full h-full flex justify-between items-center px-6">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavClick('home')}>
                    <div className="bg-teal-500 group-hover:bg-teal-400 transition p-2 rounded-lg"><Icons.Cpu className="w-6 h-6 text-white" /></div>
                    <span className="font-bold text-2xl tracking-tighter text-white">TECH<span className="text-teal-400">PLUG.</span></span>
                </div>
                
                <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wider">
                    {['home', 'services', 'products', 'trade-in'].map(nav => (
                        <button key={nav} onClick={() => handleNavClick(nav)} className={`relative group py-2 transition-colors ${activeSection === nav ? 'text-teal-400' : 'text-slate-400 hover:text-white'}`}>
                            {nav.replace('-', ' ')}
                            {activeSection === nav && <motion.span layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full"/>}
                        </button>
                    ))}
                    <div className="relative cursor-pointer ml-8 group" onClick={openCart}>
                        <Icons.ShoppingCart className="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition" />
                        {count > 0 && <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-slate-900">{count}</span>}
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-4">
                    <div className="relative cursor-pointer" onClick={openCart}>
                        <Icons.ShoppingCart className="w-6 h-6 text-slate-200" />
                        {count > 0 && <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-slate-900">{count}</span>}
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-200 hover:text-white transition p-1 rounded">
                        {isMobileMenuOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-slate-900 border-b border-slate-800 flex flex-col p-4 md:hidden shadow-xl">
                    {['home', 'services', 'products', 'trade-in'].map(nav => (
                        <button key={nav} onClick={() => handleNavClick(nav)} className="py-4 text-left text-slate-300 font-bold uppercase tracking-wider border-b border-slate-800 last:border-0 hover:text-teal-400">
                            {nav.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

// 3. Admin Inventory
const AdminInventory: React.FC = () => {
    const { products = [], addProduct, updateProduct, deleteProduct } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [form, setForm] = useState<Partial<Product>>({ name: '', price: 0, stock: 0, image: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if(selectedProduct) updateProduct(selectedProduct.id, form);
        else addProduct({ ...form, id: `p${Date.now()}` } as Product);
        setIsEditing(false); setSelectedProduct(null); setForm({ name: '', price: 0, stock: 0, image: '' });
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase">Inventory</h2>
                <button onClick={() => { setIsEditing(true); setSelectedProduct(null); setForm({}); }} className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold flex gap-2 hover:bg-teal-600 transition"><Icons.Plus className="w-5 h-5"/> New Item</button>
            </div>
            {isEditing && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
                    <form onSubmit={handleSave} className="grid grid-cols-3 gap-4">
                        <input placeholder="Name" className="border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
                        <input placeholder="Price" type="number" className="border p-2 rounded" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} required/>
                        <input placeholder="Stock" type="number" className="border p-2 rounded" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})} required/>
                        <input placeholder="Image URL" className="col-span-3 border p-2 rounded" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required/>
                        <button className="col-span-3 bg-slate-900 text-white p-2 rounded hover:bg-slate-800">Save</button>
                    </form>
                </div>
            )}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {products.map(p => (
                    <div key={p.id} className="flex justify-between p-4 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-700">{p.name} ({formatCurrency(p.price)})</span>
                        <div className="flex gap-2">
                            <button onClick={() => { setSelectedProduct(p); setForm(p); setIsEditing(true); }}><Icons.Edit className="w-4 h-4 text-slate-400 hover:text-teal-500"/></button>
                            <button onClick={() => deleteProduct(p.id)}><Icons.Trash className="w-4 h-4 text-slate-400 hover:text-red-500"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 4. Admin Service Management
const AdminServices: React.FC = () => {
    const { services = [], addServiceCategory, updateServiceCategory, deleteServiceCategory } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

    const [catForm, setCatForm] = useState<{ category: string, description: string }>({ category: '', description: '' });
    const [servicesForm, setServicesForm] = useState<ServiceItem[]>([]);

    const openEditor = (cat?: ServiceCategory) => {
        if (cat) {
            setSelectedCategory(cat);
            setCatForm({ category: cat.category, description: cat.description });
            setServicesForm(cat.services); 
        } else {
            setSelectedCategory(null);
            setCatForm({ category: '', description: '' });
            setServicesForm([]);
        }
        setIsEditing(true);
    };

    const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
        const updated = [...servicesForm];
        updated[index] = { ...updated[index], [field]: value };
        setServicesForm(updated);
    };

    const addServiceRow = () => {
        setServicesForm([...servicesForm, { id: `srv_${Date.now()}`, name: '', price: 0, description: '' }]);
    };

    const removeServiceRow = (index: number) => {
        setServicesForm(servicesForm.filter((_, i) => i !== index));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            category: catForm.category,
            description: catForm.description,
            services: servicesForm
        };

        if (selectedCategory) {
            updateServiceCategory(selectedCategory.id, payload);
        } else {
            addServiceCategory({ ...payload, id: `cat_${Date.now()}` });
        }
        setIsEditing(false);
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase">Services Management</h2>
                <button 
                    onClick={() => openEditor()} 
                    className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-600 transition shadow-md"
                >
                    <Icons.Plus className="w-5 h-5"/> New Category
                </button>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 mb-8"
                    >
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="flex justify-between font-black uppercase text-slate-400 text-xs tracking-widest">
                                <span>{selectedCategory ? 'Edit Category' : 'New Category'}</span>
                                <button type="button" onClick={() => setIsEditing(false)}><Icons.X className="w-5 h-5 hover:text-red-500"/></button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input placeholder="Category Name" className="border border-slate-200 p-4 rounded-xl w-full focus:outline-none focus:border-teal-500" value={catForm.category} onChange={e => setCatForm({...catForm, category: e.target.value})} required />
                                <input placeholder="Description" className="border border-slate-200 p-4 rounded-xl w-full focus:outline-none focus:border-teal-500" value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} required />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-900">Services in this Category</h4>
                                    <button type="button" onClick={addServiceRow} className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:text-teal-500"><Icons.Plus className="w-4 h-4"/> Add Service</button>
                                </div>
                                {servicesForm.map((srv, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input placeholder="Service Name" className="flex-1 border p-2 rounded-lg text-sm" value={srv.name} onChange={e => handleServiceChange(idx, 'name', e.target.value)} required />
                                        <input placeholder="Price" type="number" className="w-24 border p-2 rounded-lg text-sm" value={srv.price} onChange={e => handleServiceChange(idx, 'price', +e.target.value)} required />
                                        <input placeholder="Short Desc" className="flex-1 border p-2 rounded-lg text-sm" value={srv.description} onChange={e => handleServiceChange(idx, 'description', e.target.value)} />
                                        <button type="button" onClick={() => removeServiceRow(idx)} className="text-red-400 p-2 hover:text-red-500"><Icons.Trash className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                {servicesForm.length === 0 && <p className="text-sm text-slate-400 italic">No services added yet.</p>}
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase hover:bg-teal-500 transition shadow-lg">Save Category</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-6">
                {services.map(cat => (
                    <motion.div key={cat.id} layout className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{cat.category}</h3>
                                <p className="text-slate-500 text-sm">{cat.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditor(cat)} className="p-2 bg-slate-100 rounded-lg hover:text-teal-500 transition"><Icons.Edit className="w-4 h-4"/></button>
                                <button onClick={() => deleteServiceCategory(cat.id)} className="p-2 bg-slate-100 rounded-lg hover:text-red-500 transition"><Icons.Trash className="w-4 h-4"/></button>
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {cat.services.map((srv, i) => (
                                <li key={i} className="flex justify-between text-sm p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="font-semibold text-slate-700">{srv.name}</span>
                                    <span className="text-teal-600 font-bold">{formatCurrency(srv.price)}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// 5. Admin Dashboard
const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [tab, setTab] = useState('overview');
    const { orders = [], tickets = [], products = [] } = useData(); 
    
    const serviceRev = useMemo(() => tickets.filter(t => t.status === TicketStatus.COMPLETED).length * 450, [tickets]); 
    const salesRev = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
             <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col p-6 shadow-xl z-50">
                <div className="mb-10 flex items-center gap-2">
                    <div className="bg-teal-500 p-2 rounded-lg"><Icons.Shield className="w-5 h-5"/></div>
                    <span className="font-black text-xl uppercase tracking-tighter">HQ<span className="text-teal-400">Portal</span></span>
                </div>
                <nav className="flex-1 space-y-2 text-sm font-bold">
                    <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${tab === 'overview' ? 'bg-teal-500 text-slate-900 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}><Icons.LayoutDashboard className="w-5 h-5"/> Overview</button>
                    <button onClick={() => setTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${tab === 'inventory' ? 'bg-teal-500 text-slate-900 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}><Icons.Package className="w-5 h-5"/> Inventory</button>
                    <button onClick={() => setTab('services')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${tab === 'services' ? 'bg-teal-500 text-slate-900 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}><Icons.Wrench className="w-5 h-5"/> Services</button>
                    <button onClick={() => setTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${tab === 'orders' ? 'bg-teal-500 text-slate-900 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}><Icons.ShoppingCart className="w-5 h-5"/> Orders</button>
                </nav>
                <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 font-bold hover:bg-red-400/10 rounded-xl transition mt-auto"><Icons.LogOut className="w-5 h-5"/> Logout</button>
             </aside>

             <main className="flex-1 ml-64 p-10 min-h-screen">
                 {tab === 'overview' && (
                     <div className="space-y-8 animate-fade-in">
                         <h2 className="text-3xl font-black text-slate-900 uppercase">Snapshot</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex items-center gap-6 shadow-sm">
                                 <div className="p-4 bg-purple-100 rounded-2xl text-purple-600"><Icons.Wrench className="w-8 h-8"/></div>
                                 <div><h3 className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Service Rev</h3><p className="text-3xl font-black text-slate-900">{formatCurrency(serviceRev)}</p></div>
                             </div>
                             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex items-center gap-6 shadow-sm">
                                 <div className="p-4 bg-teal-100 rounded-2xl text-teal-600"><Icons.ShoppingCart className="w-8 h-8"/></div>
                                 <div><h3 className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Store Sales</h3><p className="text-3xl font-black text-slate-900">{formatCurrency(salesRev)}</p></div>
                             </div>
                         </div>
                     </div>
                 )}
                 {tab === 'inventory' && <AdminInventory />}
                 {tab === 'services' && <AdminServices />} 
                 {tab === 'orders' && (
                     <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden p-8 shadow-sm animate-fade-in">
                        <h2 className="text-3xl font-black mb-8 text-slate-900 uppercase">All Orders</h2>
                        {orders.length === 0 ? <p className="text-slate-400">No orders.</p> : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 text-slate-500 font-bold text-sm uppercase tracking-wider">ID</th><th className="p-4 text-slate-500 font-bold text-sm uppercase tracking-wider">Customer</th><th className="p-4 text-slate-500 font-bold text-sm uppercase tracking-wider">Total</th></tr></thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id} className="hover:bg-slate-50 border-b border-slate-100"><td className="p-4 text-xs font-mono text-slate-500">{o.id}</td><td className="p-4 font-medium">{o.customerName}</td><td className="p-4 font-bold text-teal-600">{formatCurrency(o.total)}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                     </div>
                 )}
             </main>
        </div>
    );
};

// 6. Admin Login
const AdminLogin: React.FC<{ onLogin: () => void, onCancel: () => void }> = ({ onLogin, onCancel }) => {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [err, setErr] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (creds.username === 'admin' && creds.password === 'techplug') onLogin();
        else setErr('Invalid credentials');
    };
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
            <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md text-center shadow-2xl">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Staff Portal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full border border-slate-200 p-4 rounded-xl focus:border-teal-500 focus:outline-none" placeholder="Username" value={creds.username} onChange={e => setCreds({...creds, username: e.target.value})}/>
                    <input className="w-full border border-slate-200 p-4 rounded-xl focus:border-teal-500 focus:outline-none" type="password" placeholder="Password" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})}/>
                    {err && <p className="text-red-500 text-sm font-bold">{err}</p>}
                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition">Login</button>
                </form>
                <button onClick={onCancel} className="mt-6 text-slate-400 text-xs font-bold uppercase hover:text-slate-600 transition">Back to Store</button>
            </div>
        </div>
    );
};

// --- APP CONTENT WRAPPER ---
const AppContent: React.FC = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Admin Toggle State
    const [showAdminMode, setShowAdminMode] = useState(false);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    const { products = [], services = [], addToCart } = useData(); 
    
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

    const handleWhatsAppServiceRequest = () => {
        let message = "Hi TechPlug! I'm interested in a repair service.";
        if (selectedService && selectedCategory) {
            message = `Hi TechPlug! I'd like to book a "${selectedService.name}" service under ${selectedCategory.category}.`;
        } else if (selectedCategory) {
            message = `Hi TechPlug! I'm interested in "${selectedCategory.category}" services.`;
        }
        sendWhatsAppMessage(message);
        setSelectedCategory(null);
        setSelectedService(null);
    };

    // Admin rendering
    if (showAdminMode) {
         if (!isAdminLoggedIn) return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} onCancel={() => setShowAdminMode(false)} />;
         return <AdminDashboard onLogout={() => { setIsAdminLoggedIn(false); setShowAdminMode(false); }} />;
    }

    // One-Page Main Render
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            <Navbar activeSection={activeSection} setActiveSection={setActiveSection} openCart={() => setIsCartOpen(true)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            
            {/* Added pt-20 to compensate for fixed header */}
            <main className="flex-grow pt-20">
                {/* HERO SECTION */}
                <section id="home" className="relative h-[calc(100vh-80px)] max-h-[800px] flex items-center overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('../src/images/background.jpg')" }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/20"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 10, stiffness: 100 }} className="max-w-2xl">
                            <motion.h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                                Revive Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Digital Life.</span>
                            </motion.h1>
                            <motion.div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => { setActiveSection('services'); scrollToSection('services'); }} className="bg-teal-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-teal-400 transition shadow-lg shadow-teal-500/30">Book Repair</button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* SERVICES SECTION */}
                <section id="services" className="py-24 bg-white">
                    <div className="px-6 max-w-4xl mx-auto text-center space-y-12">
                        <h2 className="text-5xl font-black text-slate-900 uppercase">Pro Repairs</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            Choose a service category, then select the specific repair you need for transparent pricing.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            {services.map((cat, i) => (
                                <motion.div 
                                    key={cat.id} 
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`bg-slate-50 p-8 rounded-[2rem] border ${selectedCategory?.id === cat.id ? 'border-teal-500 shadow-xl shadow-teal-500/10' : 'border-slate-100'} hover:bg-white hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between`} 
                                    onClick={() => { setSelectedCategory(cat); setSelectedService(null); }}
                                >
                                    <div>
                                        <h3 className="font-black text-teal-600 mb-2 uppercase text-xs tracking-widest">{cat.category}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{cat.description}</p>
                                    </div>
                                    <span className="mt-6 text-slate-900 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        View Services <Icons.ArrowRight className="w-4 h-4" />
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedCategory && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white p-8 rounded-3xl shadow-2xl border border-teal-500/20 mt-12 overflow-hidden ring-4 ring-teal-50"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-3xl font-black text-slate-900">{selectedCategory.category} Services</h3>
                                        <button onClick={() => setSelectedCategory(null)} className="text-slate-400 hover:text-red-500 p-2 rounded-full transition"><Icons.X className="w-6 h-6"/></button>
                                    </div>
                                    
                                    <ul className="space-y-4 text-left">
                                        {selectedCategory.services.map((service, index) => (
                                            <motion.li 
                                                key={service.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`flex justify-between items-center p-4 rounded-xl border ${selectedService?.id === service.id ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100'} hover:bg-slate-50 transition cursor-pointer`}
                                                onClick={() => setSelectedService(service)}
                                            >
                                                <div>
                                                    <p className="font-bold text-slate-900 text-lg">{service.name}</p>
                                                    <p className="text-sm text-slate-500">{service.description}</p>
                                                </div>
                                                <span className="font-black text-teal-600 text-lg">{formatCurrency(service.price)}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    
                                    <motion.button 
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        onClick={handleWhatsAppServiceRequest} 
                                        disabled={!selectedService}
                                        className="mt-8 bg-teal-500 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-4 mx-auto hover:bg-teal-600 transition shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Icons.MessageCircle className="w-7 h-7"/> 
                                        {selectedService ? `Request ${selectedService.name}` : 'Select a Service'}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {!selectedCategory && (
                            <motion.button 
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                onClick={() => sendWhatsAppMessage("Hi TechPlug! I need help with a repair.")} 
                                className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black text-xl flex items-center gap-4 mx-auto hover:bg-teal-500 transition shadow-2xl hover:shadow-teal-500/20"
                            >
                                <Icons.Phone className="w-8 h-8"/> General Inquiry
                            </motion.button>
                        )}
                    </div>
                </section>

                {/* PRODUCTS SECTION */}
                <section id="products" className="py-24 bg-slate-50 border-t border-slate-100">
                    <div className="px-6 max-w-7xl mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 uppercase mb-12 underline decoration-teal-400 decoration-8 underline-offset-8">The Catalog</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((p) => (
                                <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col group hover:shadow-xl transition-all hover:border-teal-100">
                                    <div className="h-40 mb-6 flex items-center justify-center p-4">
                                        <img src={p.image} alt={p.name} className="max-h-full mix-blend-multiply group-hover:scale-110 transition duration-300"/>
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-4 h-12 overflow-hidden">{p.name}</h3>
                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="text-xl font-black text-teal-600">{formatCurrency(p.price)}</span>
                                        <button onClick={() => addToCart(p)} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-teal-500 transition shadow-md"><Icons.Plus className="w-5 h-5"/></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {products.length === 0 && (
                            <div className="text-center py-20 text-slate-300">
                                <Icons.Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>No products available yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* TRADE-IN SECTION */}
                <section id="trade-in" className="py-32 bg-white border-t border-slate-100">
                    <div className="px-6 max-w-xl mx-auto text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                            <div className="relative z-10">
                                <Icons.Refresh className="w-20 h-20 text-teal-400 mx-auto mb-6 drop-shadow-lg" />
                                <h2 className="text-4xl font-black uppercase mb-4">Trade in your pre loved Laptop</h2>
                                <p className="text-slate-400 mb-10 leading-relaxed text-lg">Convert your preloved laptops into instant cash or store credit.</p>
                                <button onClick={() => sendWhatsAppMessage("I want to trade in my laptop.")} className="w-full bg-teal-500 text-white py-6 rounded-2xl font-black text-xl hover:bg-teal-400 transition shadow-lg shadow-teal-500/20">Start Valuation</button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            
            <footer className="bg-slate-900 text-slate-500 py-16 px-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                    <div>
                        <h4 className="text-white font-black text-2xl mb-4 tracking-tighter uppercase">TechPlug.</h4>
                        <p className="text-sm max-w-xs leading-relaxed text-slate-400">Premium repairs and high-performance refurbished tech. Since 2024.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Location & Contact</h4>
                        <p className="text-xl font-black text-white">063 367 5620</p>
                        <p className="mt-2 text-sm text-slate-400">Mahikeng, North West, South Africa</p>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><button onClick={() => { setActiveSection('products'); scrollToSection('products'); }} className="text-sm text-slate-400 hover:text-white transition">Shop Products</button></li>
                            <li><button onClick={() => { setActiveSection('services'); scrollToSection('services'); }} className="text-sm text-slate-400 hover:text-white transition">Book a Repair</button></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 text-center text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} TechPlug. All rights reserved.
                </div>
            </footer>
             <button 
                onClick={() => setShowAdminMode(true)} 
                className="fixed bottom-6 left-6 text-slate-400 hover:text-teal-400 z-50 transition p-3 bg-slate-900/50 backdrop-blur-md rounded-xl shadow-lg border border-slate-700/50"
                title="Admin Login"
            >
                <Icons.Shield className="w-6 h-6"/>
            </button>
        </div>
    );
};

const App: React.FC = () => (
    <DataProvider>
      <AppContent />
    </DataProvider>
);

export default App;