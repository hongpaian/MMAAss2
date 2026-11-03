import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
import { Button } from '../components';
import { colors } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || password.length < 6) return Alert.alert('Thiếu thông tin', 'Nhập đủ họ tên, email và mật khẩu từ 6 ký tự.');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      Alert.alert('Đăng ký thất bại', errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Tạo tài khoản</Text>
      <TextInput style={s.input} placeholder="Họ tên" value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Mật khẩu (từ 6 ký tự)" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Đăng ký" onPress={submit} loading={loading} />
      <Text style={s.link} onPress={() => navigation.goBack()}>
        Đã có tài khoản? Đăng nhập
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 13, marginBottom: 12, fontSize: 16 },
  link: { color: colors.accent, textAlign: 'center', marginTop: 20, fontSize: 15 },
});
