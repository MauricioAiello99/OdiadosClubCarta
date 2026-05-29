export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'blacklist' | 'clasicas' | 'ofertas';
    isNew?: boolean;
    detail?: string;
}

export const menuData: Product[] = [
    {
        id: '1',
        name: 'Public Enemy',
        description: 'Carne, queso cheddar, bacon, cebolla caramelizada, queso azul, salsa antipática.',
        price: 15000,
        category: 'blacklist',
        isNew: true
    },
    {
        id: '3',
        name: 'Shadowban',
        description: 'Carne, queso cheddar, salsa tasty, bacon.',
        price: 14000,
        category: 'blacklist'
    },
    {
        id: '4',
        name: 'Cancelada',
        description: 'Carne, doble queso cheddar, salsa envidia.',
        price: 13000,
        category: 'blacklist'
    },
    {
        id: '5',
        name: '4 X CANCELADAS',
        description: 'Cuatro hamburguesas canceladas: Carne, doble cheddar, salsa envidia',
        price: 45000,
        category: 'ofertas',
        detail: '🧀 Doble  cheddar'
    },
    {
        id: '6',
        name: '2 X SHADOWBAN',
        description: '2 hamburguesas shadowbans: Carne,  cheddar, salsa tasty, bacon.',
        price: 25000,
        detail: '🧀  Cheddar',
        category: 'ofertas'
    }
];