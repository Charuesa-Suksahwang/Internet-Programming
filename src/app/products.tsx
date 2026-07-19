import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ⚠️ IMPORTANT: replace this with YOUR OWN GitHub raw URL after you push
// products.json to your own repository. It must be the "Raw" link, e.g.:
// https://raw.githubusercontent.com/<your-username>/<your-repo>/main/products.json
const PRODUCTS_URL =
  'https://raw.githubusercontent.com/Charuesa-Suksahwang/Internet-Programming/refs/heads/main/products.json';

type Product = {
  id: string;
  name: string;
  stock: number;
  stock_text: string;
  category: string;
  location_count: number;
  location_text: string;
  badge_status: string; // e.g. "Active" | "Low in stock"
  image_url: string;
};

// Badge color changes depending on status, per the GUI spec.
function badgeStyleFor(status: string) {
  if (status.toLowerCase() === 'active') {
    return { backgroundColor: '#8B5CF6' }; // purple
  }
  if (status.toLowerCase().includes('low')) {
    return { backgroundColor: '#4C1D95' }; // dark purple/blue
  }
  return { backgroundColor: '#D96B43' }; // fallback
}

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(PRODUCTS_URL);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      p.category.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search + Action bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-product')}>
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Loading / error states */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#D96B43" />
          <Text style={styles.loadingText}>Loading products from GitHub...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Could not load products.</Text>
          <Text style={styles.errorSubText}>{error}</Text>
          <Text style={styles.errorSubText}>
            Check that PRODUCTS_URL in products.tsx points to your GitHub raw JSON file.
          </Text>
        </View>
      )}

      {/* Product List (FlatList, per spec) */}
      {!loading && !error && (
        <FlatList
          style={styles.productsList}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />
              <View style={styles.productInfo}>
                <View style={styles.productDetails}>
                  <Text style={styles.stockText}>Stock: {item.stock_text}</Text>
                  <Text style={styles.categoryText}>Category: {item.category}</Text>
                  <Text style={styles.locationText}>Location: {item.location_text}</Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity style={[styles.statusButton, badgeStyleFor(item.badge_status)]}>
                    <Text style={styles.statusText}>{item.badge_status}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreIcon}>⋮</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.productName}>{item.name}</Text>
            </View>
          )}
        />
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Text style={styles.navIcon}>➕</Text>
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>📦</Text>
          <Text style={styles.navTextActive}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/categories')}>
          <Text style={styles.navIcon}>📁</Text>
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  menuButton: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  menuIcon: { fontSize: 18, color: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#D96B43' },
  profileButton: { width: 30, height: 30, backgroundColor: '#D96B43', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  profileIcon: { fontSize: 16, color: 'white' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 8, paddingHorizontal: 10, marginRight: 10 },
  searchIcon: { fontSize: 16, color: '#999', marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: '#333' },
  addButton: { backgroundColor: '#D96B43', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  addButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  filterButton: { paddingHorizontal: 10, paddingVertical: 10 },
  filterText: { color: '#D96B43', fontSize: 14, fontWeight: '500' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { marginTop: 10, color: '#888', fontSize: 13 },
  errorText: { color: '#C0392B', fontWeight: '700', fontSize: 15, marginBottom: 6 },
  errorSubText: { color: '#888', fontSize: 12, textAlign: 'center', marginTop: 4 },
  productsList: { flex: 1, padding: 20 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
  productCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  productImage: { width: 60, height: 60, borderRadius: 8, marginBottom: 10, backgroundColor: '#f0f0f0' },
  productInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  productDetails: { flex: 1 },
  stockText: { fontSize: 14, color: '#666', marginBottom: 2 },
  categoryText: { fontSize: 14, color: '#666', marginBottom: 2 },
  locationText: { fontSize: 14, color: '#666' },
  productActions: { flexDirection: 'row', alignItems: 'center' },
  statusButton: { borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5, marginRight: 10 },
  statusText: { color: 'white', fontSize: 12, fontWeight: '500' },
  moreButton: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  moreIcon: { fontSize: 20, color: '#D96B43' },
  productName: { fontSize: 16, fontWeight: '600', color: '#333' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
  navIconActive: { fontSize: 22, color: '#D96B43', marginBottom: 2 },
  navTextActive: { fontSize: 10, color: '#D96B43', fontWeight: 'bold' },
});