import { Stack } from 'expo-router';
import { ProductProvider } from '../context/ProductContext';

export default function RootLayout() {
  return (
    
    <ProductProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="products" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="add-product" />
      </Stack>
    </ProductProvider>
  );
}
