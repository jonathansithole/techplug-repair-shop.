// Add these to your existing types
export interface ServiceItem {
    id: string;
    name: string;
    price: number;
    description: string;
}

export interface ServiceCategory {
    id: string;
    category: string;
    description: string;
    services: ServiceItem[];
}