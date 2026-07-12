import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Updated Logo Name */}
      <Text style={styles.logoText}>Cooking Start</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput 
          style={styles.input} 
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor="#FBCFE8"
        />
        
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password"
          placeholderTextColor="#FBCFE8"
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F4A28C',
    marginBottom: 50,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 10,
  },
  label: {
    color: '#8A8A8A',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#F5BEB0',
    width: '100%',
    maxWidth: 400,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#DF7B61',
    fontSize: 16,
    fontWeight: 'bold',
  },
});