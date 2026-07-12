import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categoriesData = [
  { id: '1', name: 'Mini Electric Pans', count: '12 items', icon: '🍳' },
  { id: '2', name: 'Shabu Hotpots', count: '18 items', icon: '🍲' },
  { id: '3', name: 'BBQ Grill Plates', count: '10 items', icon: '🥩' },
  { id: '4', name: 'Multi-Cookers', count: '15 items', icon: '🥣' },
  { id: '5', name: 'Smart Kettles', count: '8 items', icon: '🔌' },
  { id: '6', name: 'Spare Parts & Accessories', count: '25 items', icon: '⚙️' },
];

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><Text style={styles.headerIcon}>☰</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Categories List View */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categoriesData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.categoryRow}>
            <View style={styles.iconContainer}>
              <Text style={styles.categoryEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryCount}>{item.count}</Text>
            </View>
            <Text style={styles.arrowIcon}>➔</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Text style={styles.navIcon}>➕</Text>
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/products')}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>📁</Text>
          <Text style={styles.navTextActive}>Categories</Text>
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
  categoryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 3 },
  iconContainer: { backgroundColor: '#FCEAE2', width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  categoryEmoji: { fontSize: 20 },
  textContainer: { flex: 1 },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#333' },
  categoryCount: { fontSize: 12, color: '#888', marginTop: 2 },
  arrowIcon: { fontSize: 14, color: '#D96B43', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
  navIconActive: { fontSize: 22, color: '#D96B43', marginBottom: 2 },
  navTextActive: { fontSize: 10, color: '#D96B43', fontWeight: 'bold' },
});