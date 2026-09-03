import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSigningIn, signIn } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setError(null);
    try {
      await signIn({ username, password });
      router.replace('/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logoText}>Cooking Start</Text>
      <Text style={styles.subtitle}>Sign in to manage your inventory</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={(value) => {
            setUsername(value);
            setError(null);
          }}
          placeholder="Enter username"
          placeholderTextColor="#FBCFE8"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSigningIn}
        />
        
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setError(null);
          }}
          secureTextEntry
          placeholder="Enter password"
          placeholderTextColor="#FBCFE8"
          editable={!isSigningIn}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.loginButton, isSigningIn && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={isSigningIn}
      >
        {isSigningIn ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Log in</Text>}
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
    marginBottom: 8,
  },
  subtitle: { color: '#8A8A8A', fontSize: 15, marginBottom: 42 },
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
  loginButtonDisabled: { opacity: 0.65 },
  loginButtonText: {
    color: '#DF7B61',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: { color: '#B42318', fontSize: 14, marginBottom: 12, textAlign: 'center' },
});
