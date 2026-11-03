import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={s.wrap}>
      <View style={s.avatar}><Text style={s.initial}>{user.name.charAt(0).toUpperCase()}</Text></View>
      <Text style={s.name}>{user.name}</Text>
      <Text style={s.mail}>{user.email}</Text>
      <Text style={s.role}>{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</Text>
      <Button title="Đăng xuất" kind="outline" onPress={logout} style={{ marginTop: 30, alignSelf: 'stretch' }} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', padding: 24, paddingTop: 48, backgroundColor: '#fff' },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#fff', fontSize: 36, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', marginTop: 14 },
  mail: { color: colors.muted, marginTop: 2 },
  role: { marginTop: 8, color: colors.accent, fontWeight: '600' },
});
