import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProducts } from '../context/ProductContext';

export default function ProductsScreen() {
  const router = useRouter();
  const { products } = useProducts();
  const [query, setQuery] = useState('');

  // Search box was previously disabled (editable={false}) and the product
  // list was a hardcoded array. Now it filters the live, shared product list.
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

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

      {/* Search Container */}
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

      {/* Products Scroll List */}
      <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
        {filteredProducts.length === 0 && (
          <Text style={styles.emptyText}>No products found.</Text>
        )}
        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="cover" />
            <View style={styles.productInfo}>
              <View style={styles.productDetails}>
                <Text style={styles.stockText}>Stock: {product.stock} in stock</Text>
                <Text style={styles.categoryText}>Category: {product.category}</Text>
                <Text style={styles.locationText}>Code: {product.code}</Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity style={styles.statusButton}>
                  <Text style={styles.statusText}>{product.status}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreIcon}>⋮</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

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
  statusButton: { backgroundColor: '#D96B43', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5, marginRight: 10 },
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
