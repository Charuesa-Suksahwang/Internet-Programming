import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();

  const myProducts = [
    { id: '1', name: 'Electric Pan 1.5L', stock: 15 },
    { id: '2', name: 'Ceramic Electric Pan', stock: 8 },
    { id: '3', name: 'Shabu Electric Pan', stock: 20 },
  ];
  const totalStock = myProducts.reduce((sum, item) => sum + item.stock, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Updated Logo */}
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
            <Text style={styles.statNumber}>{totalStock}</Text>
            <Text style={styles.statLabel}>NEW ITEMS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>123</Text>
            <Text style={styles.statLabel}>NEW ORDERS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>REFUNDS</Text>
          </View>
        </View>

        {/* Row 2 Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>MESSAGE</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>GROUPS</Text>
          </View>
          <TouchableOpacity style={styles.viewMoreCard} onPress={() => router.push('/products')}>
            <Text style={styles.viewMoreArrow}>➔</Text>
            <Text style={styles.viewMoreText}>View more</Text>
          </TouchableOpacity>
        </View>

        {/* Sales Chart Box */}
        <Text style={styles.sectionTitle}>Sales</Text>
        <View style={styles.chartBox}>
          <View style={styles.chartBars}>
            <View style={[styles.bar, { height: 70 }]} />
            <View style={[styles.bar, { height: 110 }]} />
            <View style={[styles.bar, { height: 40 }]} />
            <View style={[styles.bar, { height: 130 }]} />
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>Confirmed</Text>
            <Text style={styles.chartLabel}>Packed</Text>
            <Text style={styles.chartLabel}>Refunded</Text>
            <Text style={styles.chartLabel}>Shipped</Text>
          </View>
        </View>

        {/* Categories Grid */}
        <Text style={styles.sectionTitle}>Top item categories</Text>
        <View style={styles.categoriesGrid}>
          <View style={styles.catBox}><Text style={styles.catEmoji}>🍳</Text></View>
          <View style={styles.catBox}><Text style={styles.catEmoji}>🔌</Text></View>
          <View style={styles.catBox}><Text style={styles.catEmoji}>🍲</Text></View>
          <View style={styles.catBox}><Text style={styles.catEmoji}>🥣</Text></View>
          <View style={styles.catBox}><Text style={styles.catEmoji}>📦</Text></View>
          <View style={styles.catBox}><Text style={styles.catEmoji}>⚙️</Text></View>
        </View>
        <TouchableOpacity><Text style={styles.centerLinkText}>View more</Text></TouchableOpacity>

        {/* Status Lists */}
        <Text style={styles.sectionTitle}>Top item categories status</Text>
        <View style={styles.listBox}>
          <View style={styles.listItem}><Text style={styles.listText}>Low stock items</Text><Text style={styles.listNum}>12 ⚠️</Text></View>
          <View style={styles.listItem}><Text style={styles.listText}>Item categories</Text><Text style={styles.listNum}>6</Text></View>
          <View style={styles.listItem_last}><Text style={styles.listText}>Refunded items</Text><Text style={styles.listNum}>1</Text></View>
        </View>

        {/* Stores List */}
        <Text style={styles.sectionTitle}>Stores list</Text>
        <View style={styles.listBox}>
          <View style={styles.listItem}><Text style={styles.listText}>Manchester, UK</Text><Text style={styles.arrow}>➔</Text></View>
          <View style={styles.listItem}><Text style={styles.listText}>Yorkshire, UK</Text><Text style={styles.arrow}>➔</Text></View>
          <View style={styles.listItem}><Text style={styles.listText}>Hull, UK</Text><Text style={styles.arrow}>➔</Text></View>
          <View style={styles.listItem_last}><Text style={styles.listText}>Leicester, UK</Text><Text style={styles.arrow}>➔</Text></View>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>➕</Text>
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/products')}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
  chartBox: { backgroundColor: '#FCEAE2', borderRadius: 12, padding: 15, height: 180, justifyContent: 'flex-end', marginBottom: 10 },
  chartBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 130, borderBottomWidth: 1, borderBottomColor: '#E6D2CA', paddingBottom: 5 },
  bar: { width: 16, backgroundColor: '#D96B43', borderRadius: 4 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  chartLabel: { fontSize: 10, color: '#666' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  catBox: { width: '31%', height: 75, backgroundColor: '#FCEAE2', borderRadius: 10, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
  catEmoji: { fontSize: 24 },
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