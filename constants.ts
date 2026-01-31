import { Product, ServiceRequest, TicketStatus, TradeInRequest, TradeInStatus, UserRole, User, Promotion, Order, OrderStatus } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Kingston 8GB DDR4 2666MHz',
    category: 'Memory',
    type: 'Component',
    brand: 'Kingston',
    condition: 'New',
    price: 450.00,
    stock: 12,
    image: 'https://picsum.photos/200/200?random=1',
    description: 'High performance Kingston 8GB DDR4 2666MHz SODIMM memory for laptops. Ideal for boosting multitasking capabilities.',
    specs: { ram: '8GB DDR4', cpu: 'N/A', storage: 'N/A' }
  },
  {
    id: 'p2',
    name: 'Samsung 870 EVO 500GB SSD',
    category: 'Storage',
    type: 'Component',
    brand: 'Samsung',
    condition: 'New',
    price: 650.00,
    stock: 8,
    image: 'https://picsum.photos/200/200?random=2',
    description: 'Samsung 870 EVO SATA III SSD. Fast read/write speeds for improved performance. 5-year warranty.',
    specs: { storage: '500GB SSD', ram: 'N/A', cpu: 'N/A' }
  },
  {
    id: 'p3',
    name: 'Dell Latitude 5490 (Refurb)',
    category: 'Laptops',
    type: 'Laptop',
    brand: 'Dell',
    condition: 'Refurbished',
    price: 4500.00,
    stock: 3,
    image: 'https://picsum.photos/200/200?random=10',
    description: 'Reliable business laptop. Fully tested and cleaned. Comes with Windows 10 Pro.',
    specs: { cpu: 'i5 8th Gen', ram: '8GB', storage: '256GB SSD' }
  },
  {
    id: 'p4',
    name: 'Logitech MK270 Combo',
    category: 'Accessories',
    type: 'Accessory',
    brand: 'Other',
    condition: 'New',
    price: 350.00,
    stock: 15,
    image: 'https://picsum.photos/200/200?random=4',
    description: 'Logitech MK270 Wireless Combo. Reliable 2.4GHz connection. Long battery life.',
    specs: { cpu: 'N/A', ram: 'N/A', storage: 'N/A' }
  },
  {
    id: 'p5',
    name: 'HP EliteBook 840 G5',
    category: 'Laptops',
    type: 'Laptop',
    brand: 'HP',
    condition: 'Refurbished',
    price: 5200.00,
    stock: 2,
    image: 'https://picsum.photos/200/200?random=11',
    description: 'Slim aluminium design, excellent for students and professionals. Bang & Olufsen audio.',
    specs: { cpu: 'i5 8350U', ram: '16GB', storage: '512GB NVMe' }
  },
  {
    id: 'p6',
    name: 'Lenovo ThinkPad T480',
    category: 'Laptops',
    type: 'Laptop',
    brand: 'Lenovo',
    condition: 'Refurbished',
    price: 4800.00,
    stock: 4,
    image: 'https://picsum.photos/200/200?random=12',
    description: 'The workhorse of laptops. Dual battery system for all-day power.',
    specs: { cpu: 'i5 8th Gen', ram: '8GB', storage: '256GB SSD' }
  },
  {
    id: 'p7',
    name: 'Office 2021 Professional',
    category: 'Software',
    type: 'Software',
    brand: 'Other',
    condition: 'New',
    price: 150.00,
    stock: 99,
    image: 'https://picsum.photos/200/200?random=6',
    description: 'Digital license key for Microsoft Office Professional Plus 2021. Word, Excel, PowerPoint.',
    specs: { cpu: 'N/A', ram: 'N/A', storage: 'N/A' }
  }
];

export const INITIAL_TICKETS: ServiceRequest[] = [
  {
    id: 't1',
    customerName: 'Thabo Mbeki',
    contactMethod: 'WhatsApp',
    contactValue: '+27 63 000 0000',
    serviceType: 'Blue Screen Fix',
    description: 'Laptop showing blue screen error 0x00000',
    status: TicketStatus.NEW,
    dateCreated: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 't2',
    customerName: 'Sarah Jenkins',
    contactMethod: 'Phone',
    contactValue: '072 123 4567',
    serviceType: 'Microsoft Office',
    description: 'Need Office 2021 installed for university work',
    status: TicketStatus.COMPLETED,
    dateCreated: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const INITIAL_TRADE_INS: TradeInRequest[] = [
  {
    id: 'tr1',
    customerName: 'John Doe',
    contact: '082 555 1234',
    deviceModel: 'Dell Inspiron 3542',
    specs: 'i3 4th Gen, 4GB RAM, 500GB HDD',
    condition: 'Screen cracked, otherwise working',
    conditionRating: 'Minor Issues',
    expectedPrice: 1500,
    status: TradeInStatus.PENDING,
    dateSubmitted: new Date(Date.now() - 86400000).toISOString(),
    imageNames: ['dell_front.jpg', 'dell_screen.jpg']
  }
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@techplug.co.za', role: UserRole.ADMIN },
  { id: 'u2', name: 'Tech Staff 1', email: 'tech1@techplug.co.za', role: UserRole.STAFF }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  { id: 'pr1', title: 'Back to School: 10% off RAM Upgrades', active: true }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    customerName: 'Alice Walker',
    email: 'alice@example.com',
    address: '123 Main St, Potchefstroom',
    items: [
        { ...INITIAL_PRODUCTS[0], quantity: 2 },
        { ...INITIAL_PRODUCTS[3], quantity: 1 }
    ],
    total: 1250.00,
    status: OrderStatus.PAID,
    date: new Date(Date.now() - 100000000).toISOString(),
    paymentMethod: 'Stripe'
  }
];

export const REPAIR_SERVICES_DATA = [
  {
    category: "Software Services",
    description: "OS, Drivers & System Optimization",
    iconKey: "window",
    items: [
      { name: "Windows Installation (any version)", price: "R200" },
      { name: "Windows Reinstallation (with data backup)", price: "R350" },
      { name: "Windows Activation", price: "R80" },
      { name: "Microsoft Office Installation", price: "R100" },
      { name: "Other Software Installations", price: "From R100" },
      { name: "Blue Screen / Black Screen Error Fix", price: "R200" },
      { name: "File Recovery (deleted files)", price: "From R250" },
      { name: "Virus & Malware Removal", price: "R200" },
      { name: "Driver Installation & Updates", price: "R150" },
      { name: "System Optimization", price: "R200" },
      { name: "Printer/Peripheral Setup", price: "R150" },
      { name: "Password Reset / Account Unlock", price: "R150" },
      { name: "Network & Sharing Setup", price: "From R200" },
      { name: "Remote Support (AnyDesk/TeamViewer)", price: "R150" },
    ]
  },
  {
    category: "Hardware Services",
    description: "Upgrades, Replacements & Physical Repairs",
    iconKey: "cpu",
    items: [
      { name: "RAM Upgrade / Replacement", price: "From R200" },
      { name: "Hard Drive Replacement / Upgrade", price: "From R450" },
      { name: "SSD Upgrade (speed upgrade)", price: "From R600" },
      { name: "Laptop Charger Replacement", price: "From R250" },
      { name: "Laptop Battery Replacement", price: "From R500" },
      { name: "Screen Replacement (Laptop/Monitor)", price: "From R900" },
      { name: "Keyboard Replacement (Laptop)", price: "From R300" },
      { name: "Touchpad Replacement", price: "From R300" },
      { name: "Motherboard Repair/Replacement", price: "From R1000" },
      { name: "Power Supply (PSU) Replacement", price: "From R450" },
      { name: "Hinge Repair (laptop)", price: "From R250" },
      { name: "General Hardware Diagnostics", price: "From R200" },
    ]
  },
  {
    category: "Data & Security",
    description: "Recovery, Transfer & Protection",
    iconKey: "database",
    items: [
      { name: "Hard Drive Data Recovery", price: "From R500" },
      { name: "Partition Management / Formatting", price: "From R200" },
      { name: "Data Transfer (old to new PC)", price: "From R250" },
    ]
  },
  {
    category: "Custom Services",
    description: "Diagnostics, Building & On-Site",
    iconKey: "wrench",
    items: [
      { name: "PC Performance Optimization", price: "R200" },
      { name: "Hardware & Software Diagnostics", price: "R200" },
      { name: "On-Site Technician Visit", price: "R150 + Travel" },
    ]
  }
];
