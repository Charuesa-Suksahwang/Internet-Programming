import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
 
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.headerIcon}>➔</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 32 }} /> 
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Personal Settings</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value="Admin VoltPan" editable={false} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value="admin@voltpan.io" editable={false} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Role</Text>
          <TextInput style={styles.input} value="Manager / Admin" editable={false} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3EFEF' },
  headerIcon: { fontSize: 18, color: '#D96B43', transform: [{ rotate: '180deg' }] },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#D96B43' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#777', marginBottom: 5 },
  input: { backgroundColor: '#FCEAE2', color: '#555', padding: 15, borderRadius: 8, fontSize: 16 },
  logoutBtn: { backgroundColor: '#F44336', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  logoutBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});