import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL, useAuth } from './AuthContext';

export const PRODUCTS_URL = `${API_BASE_URL}/products`;

export type Product = {
  id: string | number;
  name: string;
  stock?: number | string;
  category?: string;
  location?: string;
  image?: string;
  status?: string;
  brand?: string;
  sizes?: string;
  orderName?: string;
  description?: string;
  price?: number | string;
  productCode?: string;
};

export type CategorySummary = {
  name: string;
  count: number;
  icon: string;
};

type ProductContextType = {
  products: Product[];
  categories: CategorySummary[];
  totalStock: number;
  lowStockCount: number;
  storeCount: number;
  lowStockThreshold: number;
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
};

const CATEGORY_ICONS: Record<string, string> = {
  Appliances: '🍳',
  Cookware: '🍲',
  Grill: '🥩',
  'Multi-Cookers': '🥣',
  Electronics: '🔌',
  'Spare Parts & Accessories': '⚙️',
};

const LOW_STOCK_THRESHOLD = 10;

const ProductContext = createContext<ProductContextType | undefined>(undefined);

function iconForCategory(name: string) {
  return CATEGORY_ICONS[name] ?? '📦';
}

function stockFor(product: Product) {
  const stock = Number(product.stock);
  return Number.isFinite(stock) ? stock : 0;
}

function storesFor(product: Product) {
  const match = product.location?.match(/(\d+)\s*stores?/i);
  return match ? Number(match[1]) : 0;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, apiFetch } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    if (!accessToken) {
      setProducts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/products');
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('The products API returned an invalid response');
      }
      setProducts(data as Product[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiFetch]);

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  const categories = useMemo<CategorySummary[]>(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      const category = product.category?.trim();
      if (!category) return;
      counts.set(category, (counts.get(category) ?? 0) + 1);
    });

    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
      icon: iconForCategory(name),
    }));
  }, [products]);

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + stockFor(product), 0),
    [products]
  );

  const lowStockCount = useMemo(
    () => products.filter((product) => stockFor(product) <= LOW_STOCK_THRESHOLD).length,
    [products]
  );

  // The API reports each product's number of store locations. The highest value
  // is the current number of stores represented by the catalogue.
  const storeCount = useMemo(
    () => products.reduce((highest, product) => Math.max(highest, storesFor(product)), 0),
    [products]
  );

  const value: ProductContextType = {
    products,
    categories,
    totalStock,
    lowStockCount,
    storeCount,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    isLoading,
    error,
    refreshProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used inside a <ProductProvider>');
  }
  return context;
}
