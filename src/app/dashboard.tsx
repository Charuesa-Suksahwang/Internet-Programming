import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProducts } from '../context/ProductContext';

export default function DashboardScreen() {
  const router = useRouter();
  const {
    products,
    categories,
    totalStock,
    lowStockCount,
    storeCount,
    isLoading,
    error,
    refreshProducts,
  } = useProducts();

  useFocusEffect(
    useCallback(() => {
      void refreshProducts();
    }, [refreshProducts])
  );

  // "New items" = number of products currently in the catalog (updates the
  // moment a product is added on the Add Product screen).
  const newItemsCount = products.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><Text style={styles.headerIcon}>☰</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Cooking Start</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Activity Section */}
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{isLoading && products.length === 0 ? '–' : newItemsCount}</Text>
            <Text style={styles.statLabel}>PRODUCTS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{isLoading && products.length === 0 ? '–' : totalStock}</Text>
            <Text style={styles.statLabel}>TOTAL STOCK</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{isLoading && products.length === 0 ? '–' : lowStockCount}</Text>
            <Text style={styles.statLabel}>LOW STOCK</Text>
          </View>
        </View>

        {/* Row 2 Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{isLoading && products.length === 0 ? '–' : categories.length}</Text>
            <Text style={styles.statLabel}>CATEGORIES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{isLoading && products.length === 0 ? '–' : storeCount}</Text>
            <Text style={styles.statLabel}>STORES</Text>
          </View>
          <TouchableOpacity style={styles.viewMoreCard} onPress={() => router.push('/products')}>
            <Text style={styles.viewMoreArrow}>➔</Text>
            <Text style={styles.viewMoreText}>View more</Text>
          </TouchableOpacity>
        </View>

        {isLoading && products.length === 0 && (
          <View style={styles.activityStatus}>
            <ActivityIndicator size="small" color="#D96B43" />
            <Text style={styles.activityStatusText}>Loading current product activity...</Text>
          </View>
        )}
        {error && products.length === 0 && (
          <Text style={styles.activityError}>Could not load the current product activity. Please try again.</Text>
        )}

        {/* Stock by product (replaces the fake static bar chart) */}
        <Text style={styles.sectionTitle}>Stock by product</Text>
        <View style={styles.chartBox}>
          <View style={styles.chartBars}>
            {products.slice(0, 4).map((p) => (
              <View
                key={p.id}
                style={[
                  styles.bar,
                  { height: Math.min(130, Math.max(10, Number(p.stock) * 4 || 10)) },
                ]}
              />
            ))}
          </View>
          <View style={styles.chartLabels}>
            {products.slice(0, 4).map((p) => (
              <Text key={p.id} style={styles.chartLabel} numberOfLines={1}>
                {p.name.length > 10 ? `${p.name.slice(0, 10)}…` : p.name}
              </Text>
            ))}
          </View>
        </View>

        {/* Categories Grid - now driven by real product categories */}
        <Text style={styles.sectionTitle}>Item categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <View key={cat.name} style={styles.catBox}>
              <Text style={styles.catEmoji}>{cat.icon}</Text>
              <Text style={styles.catCount}>{cat.count}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={() => router.push('/categories')}>
          <Text style={styles.centerLinkText}>View more</Text>
        </TouchableOpacity>

        {/* Status Lists */}
        <Text style={styles.sectionTitle}>Inventory status</Text>
        <View style={styles.listBox}>
          <View style={styles.listItem}>
            <Text style={styles.listText}>Low stock items</Text>
            <Text style={styles.listNum}>{lowStockCount} ⚠️</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listText}>Item categories</Text>
            <Text style={styles.listNum}>{categories.length}</Text>
          </View>
          <View style={styles.listItem_last}>
            <Text style={styles.listText}>Total products</Text>
            <Text style={styles.listNum}>{products.length}</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Text style={styles.navIcon}>➕</Text>
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/products')}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Products</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3EFEF' },
  headerIcon: { fontSize: 22, color: '#D96B43' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#D96B43' },
  profileBtn: { backgroundColor: '#D96B43', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  profileIcon: { fontSize: 14, color: 'white' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12, marginTop: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statCard: { backgroundColor: 'white', padding: 12, borderRadius: 10, alignItems: 'center', width: '31%', elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#D96B43', marginBottom: 2 },
  statLabel: { fontSize: 9, color: '#888', fontWeight: '600', textAlign: 'center' },
  viewMoreCard: { backgroundColor: '#FCEAE2', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', width: '31%' },
  viewMoreArrow: { fontSize: 16, color: '#D96B43', fontWeight: 'bold' },
  viewMoreText: { fontSize: 9, color: '#D96B43', fontWeight: 'bold', marginTop: 2 },
  activityStatus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  activityStatusText: { marginLeft: 8, color: '#888', fontSize: 12 },
  activityError: { color: '#B42318', fontSize: 12, textAlign: 'center', marginBottom: 8 },
  chartBox: { backgroundColor: '#FCEAE2', borderRadius: 12, padding: 15, height: 180, justifyContent: 'flex-end', marginBottom: 10 },
  chartBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 130, borderBottomWidth: 1, borderBottomColor: '#E6D2CA', paddingBottom: 5 },
  bar: { width: 16, backgroundColor: '#D96B43', borderRadius: 4 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  chartLabel: { fontSize: 9, color: '#666', width: 60, textAlign: 'center' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  catBox: { width: '31%', height: 75, backgroundColor: '#FCEAE2', borderRadius: 10, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
  catEmoji: { fontSize: 24 },
  catCount: { fontSize: 11, color: '#D96B43', fontWeight: 'bold', marginTop: 4 },
  centerLinkText: { textAlign: 'center', color: '#888', fontSize: 12, textDecorationLine: 'underline', marginBottom: 15 },
  listBox: { backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, elevation: 1, marginBottom: 5 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3EFEF' },
  listItem_last: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  listText: { fontSize: 14, color: '#444' },
  listNum: { fontSize: 14, fontWeight: '600', color: '#333' },
  arrow: { fontSize: 12, color: '#D96B43' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
  navIconActive: { fontSize: 22, color: '#D96B43', marginBottom: 2 },
  navTextActive: { fontSize: 10, color: '#D96B43', fontWeight: 'bold' },
});
