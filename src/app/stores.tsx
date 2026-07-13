import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StoresScreen() {
  const router = useRouter();

  const stores = [
    { id: '1', name: 'Manchester, UK', employees: 25, items: 304, status: 'Open' },
    { id: '2', name: 'Yorkshire, UK', employees: 12, items: 150, status: 'Open' },
    { id: '3', name: 'Hull, UK', employees: 8, items: 85, status: 'Closed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.headerIcon}>➔</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Stores</Text>
        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/settings')}><Text style={styles.profileIcon}>👤</Text></TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {stores.map((store) => (
          <View key={store.id} style={styles.storeCard}>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.storeDetails}>
              <Text style={styles.detailText}>Employees: {store.employees}</Text>
              <Text style={styles.detailText}>Items in stock: {store.items}</Text>
              <Text style={styles.detailText}>Status: <Text style={{ color: store.status === 'Open' ? '#4CAF50' : '#F44336' }}>{store.status}</Text></Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}><Text style={styles.navIcon}>🏠</Text><Text style={styles.navText}>Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}><Text style={styles.navIcon}>➕</Text><Text style={styles.navText}>Add</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/products')}><Text style={styles.navIcon}>📦</Text><Text style={styles.navText}>Products</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/categories')}><Text style={styles.navIcon}>📁</Text><Text style={styles.navText}>Categories</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3EFEF' },
  headerIcon: { fontSize: 18, color: '#D96B43', transform: [{ rotate: '180deg' }] },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#D96B43' },
  profileBtn: { backgroundColor: '#D96B43', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  profileIcon: { fontSize: 14, color: 'white' },
  content: { padding: 20 },
  storeCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  storeName: { fontSize: 18, fontWeight: 'bold', color: '#D96B43', marginBottom: 10 },
  storeDetails: { gap: 5 },
  detailText: { fontSize: 14, color: '#555' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
});