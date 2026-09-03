import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { Product, useProducts } from '../context/ProductContext';

function badgeStyleFor(status: string) {
  if (!status) return { backgroundColor: '#D96B43' };
  const safeStatus = status.toLowerCase().trim();
  if (safeStatus.includes('active')) return { backgroundColor: '#8B5CF6' };
  if (safeStatus.includes('low')) return { backgroundColor: '#4C1D95' };
  return { backgroundColor: '#D96B43' };
}

export default function ProductsScreen() {
  const router = useRouter();
  const { apiFetch } = useAuth();
  const { products, isLoading: loading, error, refreshProducts } = useProducts();
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      // ทุกครั้งที่เข้าหน้านี้ ให้ดึงรายการสินค้าล่าสุดจาก Backend
      void refreshProducts();
    }, [refreshProducts])
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category?.toLowerCase().includes(normalizedQuery)
    );
  }, [products, query]);

  // เมื่อกดปุ่มดินสอ: ส่งข้อมูลสินค้าที่เลือกไปหน้า add-product
  // หน้า add-product จะเห็น id จึงรู้ว่าเป็นการแก้ไข (PUT) ไม่ใช่เพิ่มใหม่ (POST)
  const handleEditPress = (item: Product) => {
    router.push({
      pathname: '/add-product',
      params: {
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.category || '',
        price: item.price ? String(item.price) : '',
        stock: item.stock !== undefined ? String(item.stock) : '',
        productCode: item.productCode || '',
        location: item.location || '',
        status: item.status || 'Active',
        brand: item.brand || '',
        sizes: item.sizes || '',
        orderName: item.orderName || '',
        image: item.image || '',
      }
    });
  };

  // ลบสินค้าจริงจากฐานข้อมูล โดยเรียก DELETE /api/products/:id
  const doDelete = async (item: Product) => {
    try {
      setDeletingId(String(item.id));
      const response = await apiFetch(`/products/${item.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // ลบสำเร็จแล้ว โหลดรายการใหม่ เพื่อให้สินค้าหายจากหน้าจอทันที
        await refreshProducts();
      } else {
        const msg = 'ไม่สามารถลบสินค้าได้';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Error', msg);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      const msg = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // เมื่อกดปุ่มถังขยะ: ถามยืนยันก่อนลบ เพราะการลบไม่สามารถย้อนกลับได้
  // Alert.alert แบบหลายปุ่มไม่ทำงานบน react-native-web
  // เลยต้องเช็ค Platform แล้วใช้ window.confirm() แทนตอนรันบนเว็บ
  const handleDeletePress = (item: Product) => {
    const message = `ต้องการลบสินค้า "${item.name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) {
        doDelete(item);
      }
      return;
    }

    Alert.alert(
      'ยืนยันการลบ',
      message,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'ลบ', style: 'destructive', onPress: () => doDelete(item) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

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
        {/* เปิดฟอร์มโดยไม่ส่ง id: จึงเป็นการเพิ่มสินค้าใหม่ */}
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-product')}>
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      {loading && products.length === 0 && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#D96B43" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      )}

      <FlatList
        style={styles.productsList}
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No products found.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
              ) : (
                <View style={styles.productImagePlaceholder} />
              )}
              
              <View style={styles.productDetails}>
                <Text style={styles.stockText}>Stock: {item.stock || 0} in stock</Text>
                <Text style={styles.categoryText}>Category: {item.category}</Text>
                <Text style={styles.locationText}>Location: {item.location || 'No location'}</Text>
              </View>
              
              <View style={styles.productActions}>
                <TouchableOpacity style={[styles.statusButton, badgeStyleFor(item.status ?? '')]}>
                  <Text style={styles.statusText}>{item.status || 'Active'}</Text>
                </TouchableOpacity>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    // ส่งสินค้ารายนี้ไปเติมในฟอร์มแก้ไข
                    onPress={() => handleEditPress(item)}
                    disabled={deletingId === String(item.id)}
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    // แสดงกล่องยืนยันก่อนลบสินค้ารายนี้
                    onPress={() => handleDeletePress(item)}
                    disabled={deletingId === String(item.id)}
                  >
                    {deletingId === String(item.id) ? (
                      <ActivityIndicator size="small" color="#D96B43" />
                    ) : (
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          </View>
        )}
      />

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
  addButton: { backgroundColor: '#D96B43', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10 },
  addButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { marginTop: 10, color: '#888', fontSize: 13 },
  productsList: { flex: 1, padding: 20 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
  productCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#f0f0f0' },
  productImagePlaceholder: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#e0e0e0' },
  productInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  productDetails: { flex: 1 },
  stockText: { fontSize: 14, color: '#666', marginBottom: 2 },
  categoryText: { fontSize: 14, color: '#666', marginBottom: 2 },
  locationText: { fontSize: 14, color: '#666' },
  productActions: { alignItems: 'flex-end', justifyContent: 'space-between', height: 60 },
  statusButton: { borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5, marginBottom: 10 },
  statusText: { color: 'white', fontSize: 12, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 4 },
  iconButton: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  editIcon: { fontSize: 18 },
  deleteIcon: { fontSize: 18 },
  productName: { fontSize: 16, fontWeight: '600', color: '#333' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
  navIconActive: { fontSize: 22, color: '#D96B43', marginBottom: 2 },
  navTextActive: { fontSize: 10, color: '#D96B43', fontWeight: 'bold' },
});
