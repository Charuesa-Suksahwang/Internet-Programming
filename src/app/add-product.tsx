import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // มี id ที่ส่งมาจากหน้ารายการสินค้า = เปิดฟอร์มเพื่อแก้ไขสินค้าเดิม
  // ไม่มี id = เปิดฟอร์มเพื่อเพิ่มสินค้าใหม่
  const isEditMode = Boolean(params.id);
  const { apiFetch } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Active');
  const [brand, setBrand] = useState('');
  const [sizes, setSizes] = useState('');
  const [orderName, setOrderName] = useState('');
  const [image, setImage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // สำคัญ: ผูก dependency กับ params.id (ค่าคงที่) แทน params ทั้ง object
  // เพราะ useLocalSearchParams() คืน object ใหม่ทุก re-render แม้ค่าจะเหมือนเดิม
  // ถ้าผูกกับ params ทั้งก้อน useEffect จะรันซ้ำแทบทุกครั้งที่พิมพ์/วางข้อความ
  // แล้วเซ็ตค่ากลับไปเป็นค่าเดิมจาก URL params ทันที ทำให้ดูเหมือนพิมพ์แล้วหายไป
  useEffect(() => {
    if (isEditMode) {
      // นำข้อมูลเดิมจากสินค้าที่กดปุ่มดินสอ มาเติมลงในช่องฟอร์ม
      setName(params.name ? String(params.name) : '');
      setDescription(params.description ? String(params.description) : '');
      setCategory(params.category ? String(params.category) : '');
      setPrice(params.price ? String(params.price) : '');
      setStock(params.stock !== undefined ? String(params.stock) : '');
      setItemCode(params.productCode ? String(params.productCode) : '');
      setLocation(params.location ? String(params.location) : '');
      setStatus(params.status ? String(params.status) : 'Active');
      setBrand(params.brand ? String(params.brand) : '');
      setSizes(params.sizes ? String(params.sizes) : '');
      setOrderName(params.orderName ? String(params.orderName) : '');
      setImage(params.image ? String(params.image) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleSaveProduct = async () => {
    // ตรวจข้อมูลที่จำเป็นก่อนส่งไปบันทึกในฐานข้อมูล
    if (!name || !category || !price || !stock || !itemCode) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน');
      return;
    }

    const stockNumber = Number(stock);
    // สต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป
    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุจำนวนสต็อกเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
      return;
    }

    setIsSubmitting(true);
    try {
      // เพิ่มใหม่ใช้ POST /products ส่วนแก้ไขใช้ PUT /products/:id
      const endpoint = isEditMode ? `/products/${params.id}` : '/products';
      const method = isEditMode ? 'PUT' : 'POST';

      // ส่งข้อมูลจากฟอร์มไปยัง Backend เพื่อบันทึกลง MySQL
      const response = await apiFetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          category,
          price,
          stock: stockNumber,
          productCode: itemCode,
          location,
          status,
          brand,
          sizes,
          orderName,
          image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // เมื่อบันทึกสำเร็จ กลับไปหน้า Products ซึ่งจะโหลดรายการล่าสุดมาแสดง
        Alert.alert('สำเร็จ', isEditMode ? 'แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว!' : 'เพิ่มสินค้าใหม่เรียบร้อยแล้ว!', [
          { text: 'OK', onPress: () => router.push('/products') }
        ]);
      } else {
        Alert.alert('ข้อผิดพลาด', data.error || 'ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (error) {
      console.error('Save product error:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Product' : 'Add Product'}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Smart Electric Pan"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter product details..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Category*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Appliances"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Price*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 590"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Stock Qty*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 50"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={stock}
          onChangeText={setStock}
        />

        <Text style={styles.label}>Item Code*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. VP-004"
          placeholderTextColor="#999"
          value={itemCode}
          onChangeText={setItemCode}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 3 stores"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Status</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Active"
          placeholderTextColor="#999"
          value={status}
          onChangeText={setStatus}
        />

        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Simplus"
          placeholderTextColor="#999"
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={styles.label}>Size</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 5 litres"
          placeholderTextColor="#999"
          value={sizes}
          onChangeText={setSizes}
        />

        <Text style={styles.label}>Order Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. PO-2026-001"
          placeholderTextColor="#999"
          value={orderName}
          onChangeText={setOrderName}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. https://example.com/image.jpg"
          placeholderTextColor="#999"
          value={image}
          onChangeText={setImage}
        />
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        ) : null}
        
        <TouchableOpacity 
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]} 
          onPress={handleSaveProduct}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>{isEditMode ? 'Update Product' : 'Save Product'}</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Text style={styles.navIconActive}>➕</Text>
          <Text style={styles.navTextActive}>Add</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  backButton: { width: 30, height: 30, justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#D96B43', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#D96B43' },
  profileButton: { width: 30, height: 30, backgroundColor: '#D96B43', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  profileIcon: { fontSize: 16, color: 'white' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#E6D2CA', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#333' },
  imagePreview: { width: 120, height: 120, borderRadius: 8, marginTop: 10, backgroundColor: '#f0f0f0' },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#D96B43', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, shadowColor: '#D96B43', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  saveButtonDisabled: { backgroundColor: '#EAA48B' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
  navIconActive: { fontSize: 22, color: '#D96B43', marginBottom: 2 },
  navTextActive: { fontSize: 10, color: '#D96B43', fontWeight: 'bold' },
});
