import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProductProvider } from '../context/ProductContext';

function RootNavigator() {
  const { accessToken } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!accessToken}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(accessToken)}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="products" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="add-product" />
        <Stack.Screen name="stores" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="finances" />
        <Stack.Screen name="explore" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <RootNavigator />
      </ProductProvider>
    </AuthProvider>
  );
}
