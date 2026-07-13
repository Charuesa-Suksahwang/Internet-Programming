import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FinancesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.headerIcon}>➔</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Finances</Text>
        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/settings')}><Text style={styles.profileIcon}>👤</Text></TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.financeCard}>
          <Text style={styles.cardTitle}>Net Sales</Text>
          <Text style={styles.amount}>$12,450.00</Text>
          <Text style={styles.positiveChange}>▲ +15% from last month</Text>
        </View>

        <View style={styles.financeCard}>
          <Text style={styles.cardTitle}>Gross Profit</Text>
          <Text style={styles.amount}>$4,320.50</Text>
          <Text style={styles.positiveChange}>▲ +8% from last month</Text>
        </View>

        <View style={styles.financeCard}>
          <Text style={styles.cardTitle}>Refunds</Text>
          <Text style={styles.amountError}>$210.00</Text>
          <Text style={styles.negativeChange}>▼ -2% from last month</Text>
        </View>
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
  financeCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, color: '#777', fontWeight: '600' },
  amount: { fontSize: 28, fontWeight: 'bold', color: '#333', marginVertical: 10 },
  amountError: { fontSize: 28, fontWeight: 'bold', color: '#F44336', marginVertical: 10 },
  positiveChange: { fontSize: 14, color: '#4CAF50' },
  negativeChange: { fontSize: 14, color: '#F44336' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
});