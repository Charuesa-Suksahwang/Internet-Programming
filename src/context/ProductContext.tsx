import React, { createContext, useContext, useMemo, useState } from 'react';

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  code: string;
  stock: number;
  imageUrl: string;
  status: 'Active' | 'Inactive';
  createdAt: number;
};

export type CategorySummary = {
  name: string;
  count: number;
  icon: string;
};

type NewProductInput = {
  name: string;
  description: string;
  category: string;
  price: string;
  code: string;
  stock: number;
  imageUrl?: string;
};

type ProductContextType = {
  products: Product[];
  categories: CategorySummary[];
  addProduct: (input: NewProductInput) => void;
  removeProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  totalStock: number;
  lowStockCount: number;
  lowStockThreshold: number;
};

// Emoji fallback per category name so new categories still get an icon.
const CATEGORY_ICONS: Record<string, string> = {
  Appliances: '🍳',
  Cookware: '🍲',
  Grill: '🥩',
  'Multi-Cookers': '🥣',
  Electronics: '🔌',
  'Spare Parts & Accessories': '⚙️',
};

function iconForCategory(name: string) {
  return CATEGORY_ICONS[name] ?? '📦';
}

const initialProducts: Product[] = [];

const LOW_STOCK_THRESHOLD = 10;

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (input: NewProductInput) => {
    const newProduct: Product = {
      id: `p_${Date.now()}`,
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      price: input.price.trim(),
      code: input.code.trim(),
      stock: input.stock,
      imageUrl:
        input.imageUrl ||
        `https://via.placeholder.com/80x80/F5BEB0/333333?text=${encodeURIComponent(
          input.name.slice(0, 10) || 'Product'
        )}`,
      status: 'Active',
      createdAt: Date.now(),
    };
    // Prepend so newest product shows first everywhere (Products, Dashboard, Categories).
    setProducts((prev) => [newProduct, ...prev]);
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = (id: string, stock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock } : p)));
  };

  const categories = useMemo<CategorySummary[]>(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (!p.category) return;
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
      icon: iconForCategory(name),
    }));
  }, [products]);

  const totalStock = useMemo(
    () => products.reduce((sum, p) => sum + (Number.isFinite(p.stock) ? p.stock : 0), 0),
    [products]
  );

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).length,
    [products]
  );

  const value: ProductContextType = {
    products,
    categories,
    addProduct,
    removeProduct,
    updateStock,
    totalStock,
    lowStockCount,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used inside a <ProductProvider>');
  }
  return ctx;
}