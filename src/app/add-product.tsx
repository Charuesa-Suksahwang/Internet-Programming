import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProducts } from '../context/ProductContext';

export default function AddProductScreen() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [code, setCode] = useState('');
  const [stock, setStock] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    // Ask for permission to access the photo library first.
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Basic validation for the required fields (marked with *).
    if (!name.trim() || !category.trim() || !price.trim() || !code.trim() || !stock.trim()) {
      Alert.alert('Missing information', 'Please fill in all fields marked with *.');
      return;
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      Alert.alert('Invalid stock', 'Please enter a valid stock quantity.');
      return;
    }

    // This is the actual fix: previously handleSave only showed an alert and
    // navigated away without ever storing the product anywhere. Now it is
    // pushed into the shared ProductContext, so Products, Dashboard, and
    // Categories all update immediately.
    addProduct({
      name,
      description,
      category,
      price,
      code,
      stock: stockNumber,
      imageUrl: imageUri ?? undefined,
    });

    Alert.alert('Success', 'Product saved successfully!');
    router.push('/products');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerIcon}>➔</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Input Form Fields */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.inputLabel}>Name*</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Smart Electric Pan"
        />

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product details..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.inputLabel}>Category*</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Appliances"
        />

        <Text style={styles.inputLabel}>Price*</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 590"
          keyboardType="numeric"
        />

        <Text style={styles.inputLabel}>Item Code*</Text>
        <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder="e.g. VP-004" />

        <Text style={styles.inputLabel}>Stock Qty*</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="e.g. 50"
          keyboardType="numeric"
        />

        {/* Upload Photos Area Box */}
        <Text style={styles.inputLabel}>Product Photos*</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.uploadText}>+ Upload Images</Text>
          )}
        </TouchableOpacity>
        {imageUri && (
          <TouchableOpacity onPress={() => setImageUri(null)}>
            <Text style={styles.removeImageText}>Remove photo</Text>
          </TouchableOpacity>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save product</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3EFEF' },
  headerIcon: { fontSize: 18, color: '#D96B43', transform: [{ rotate: '180deg' }] },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#D96B43' },
  profileBtn: { backgroundColor: '#D96B43', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  profileIcon: { fontSize: 14, color: 'white' },
  content: { padding: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 5 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#EAE5E3', borderRadius: 8, height: 45, paddingHorizontal: 15, marginBottom: 15, fontSize: 15 },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  uploadBox: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#D96B43', borderRadius: 8, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FCEAE2', marginBottom: 8, overflow: 'hidden' },
  uploadText: { color: '#D96B43', fontWeight: '600', fontSize: 14 },
  previewImage: { width: '100%', height: '100%' },
  removeImageText: { color: '#D96B43', fontSize: 12, textAlign: 'center', marginBottom: 17, textDecorationLine: 'underline' },
  saveButton: { backgroundColor: '#D96B43', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#DDD', marginBottom: 2 },
  navText: { fontSize: 10, color: '#BBB' },
  navIconActive: { fontSize: 22, color: '#D96B43', marginBottom: 2 },
  navTextActive: { fontSize: 10, color: '#D96B43', fontWeight: 'bold' },
});
