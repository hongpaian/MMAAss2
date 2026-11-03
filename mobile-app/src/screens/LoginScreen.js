import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
import { Button } from '../components';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) return Alert.alert('Thiếu thông tin', 'Nhập email và mật khẩu.');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Đăng nhập thất bại', errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Đặt đồ ăn</Text>
        <Text style={s.sub}>Đăng nhập để đặt món yêu thích.</Text>
        <TextInput style={s.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={s.input} placeholder="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />
        <Button title="Đăng nhập" onPress={submit} loading={loading} />
        <Text style={s.link} onPress={() => navigation.navigate('Register')}>
          Chưa có tài khoản? Đăng ký
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: '800', color: colors.ink },
  sub: { color: colors.muted, marginBottom: 24, marginTop: 4 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 13, marginBottom: 12, fontSize: 16 },
  link: { color: colors.accent, textAlign: 'center', marginTop: 20, fontSize: 15 },
});
