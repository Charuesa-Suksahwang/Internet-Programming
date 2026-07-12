import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="products" />
      <Stack.Screen name="categories" />   {/* <-- เพิ่มหน้านี้ */}
      <Stack.Screen name="add-product" />  {/* <-- เพิ่มหน้านี้ */}
    </Stack>
  );
}