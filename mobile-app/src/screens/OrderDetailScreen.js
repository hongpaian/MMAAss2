import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { errMsg } from '../api';
import { Button, ErrorView, Loading } from '../components';
import { colors, formatVND, STATUS_COLOR, STATUS_LABEL } from '../theme';

export default function OrderDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setError('');
    api.get(`/orders/${id}`).then((r) => setOrder(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);
  useFocusEffect(load);

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!order) return <Loading />;

  const cancel = () =>
    Alert.alert('Hủy đơn hàng?', 'Bạn chắc chắn muốn hủy đơn này?', [
      { text: 'Không' },
      {
        text: 'Hủy đơn',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            setOrder((await api.put(`/orders/${id}/cancel`)).data);
          } catch (e) {
            Alert.alert('Không hủy được', errMsg(e));
          } finally {
            setBusy(false);
          }
        },
      },
    ]);

  const needPay = order.paymentStatus === 'unpaid' && order.paymentMethod !== 'COD' && order.status !== 'cancelled';

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.code}>Đơn #{order._id.slice(-6).toUpperCase()}</Text>
      <Text style={[s.status, { color: STATUS_COLOR[order.status] }]}>{STATUS_LABEL[order.status]}</Text>

      <Text style={s.h}>Món đã đặt</Text>
      {order.items.map((i, idx) => (
        <View key={idx} style={s.line}>
          <Text style={{ flex: 1 }}>{i.qty} × {i.name}</Text>
          <Text>{formatVND(i.qty * i.price)}</Text>
        </View>
      ))}
      <View style={[s.line, { marginTop: 8 }]}>
        <Text style={{ fontWeight: '800' }}>Tổng cộng</Text>
        <Text style={{ fontWeight: '800', color: colors.accent, fontSize: 18 }}>{formatVND(order.total)}</Text>
      </View>

      <Text style={s.h}>Giao hàng</Text>
      <Text>{order.address}</Text>
      <Text style={{ color: colors.muted }}>{order.phone}</Text>
      {!!order.note && <Text style={{ color: colors.muted }}>Ghi chú: {order.note}</Text>}

      <Text style={s.h}>Thanh toán</Text>
      <Text>{order.paymentMethod} · {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
      {!!order.transactionId && <Text style={{ color: colors.muted }}>Mã giao dịch: {order.transactionId}</Text>}

      {needPay && <Button title="Thanh toán ngay" onPress={() => navigation.navigate('Payment', { id })} style={{ marginTop: 20 }} />}
      {order.status === 'pending' && <Button title="Hủy đơn" kind="outline" onPress={cancel} loading={busy} style={{ marginTop: 12 }} />}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  code: { fontSize: 22, fontWeight: '800', color: colors.ink },
  status: { fontWeight: '700', marginTop: 2, fontSize: 15 },
  h: { fontSize: 16, fontWeight: '700', marginTop: 22, marginBottom: 8 },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
});
