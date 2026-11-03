import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { errMsg } from '../api';
import { Empty, ErrorView, Loading } from '../components';
import { colors, formatVND, STATUS_COLOR, STATUS_LABEL } from '../theme';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setOrders((await api.get('/orders/my')).data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Mỗi lần quay lại tab này thì tải lại danh sách
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!orders) return <Loading />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={orders}
      keyExtractor={(o) => o._id}
      contentContainerStyle={{ padding: 12, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      ListEmptyComponent={<Empty text="Bạn chưa có đơn hàng nào." />}
      renderItem={({ item }) => (
        <Pressable style={s.card} onPress={() => navigation.navigate('OrderDetail', { id: item._id })}>
          <View style={s.top}>
            <Text style={s.code}>#{item._id.slice(-6).toUpperCase()}</Text>
            <Text style={[s.badge, { color: STATUS_COLOR[item.status] }]}>{STATUS_LABEL[item.status]}</Text>
          </View>
          <Text style={{ color: colors.muted }} numberOfLines={1}>{item.items.map((i) => `${i.qty} × ${i.name}`).join(', ')}</Text>
          <View style={s.top}>
            <Text style={{ color: colors.muted, fontSize: 13 }}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
            <Text style={s.total}>{formatVND(item.total)}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.line, gap: 6 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontWeight: '800', fontSize: 16 },
  badge: { fontWeight: '700' },
  total: { fontWeight: '800', color: colors.accent, fontSize: 16 },
});
