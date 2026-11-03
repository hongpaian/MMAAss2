import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import api, { errMsg } from '../api';
import { Button, ErrorView, Loading } from '../components';
import { colors, formatVND } from '../theme';

// Màn thanh toán MÔ PHỎNG VNPay / MoMo (không gọi cổng thật)
export default function PaymentScreen({ route, navigation }) {
  const { id } = route.params;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  if (error) return <ErrorView message={error} />;
  if (!order) return <Loading />;

  const method = order.paymentMethod === 'MOMO' ? 'MOMO' : 'VNPAY';
  const name = method === 'MOMO' ? 'Ví MoMo' : 'VNPay';

  const pay = async () => {
    setPaying(true);
    try {
      await new Promise((r) => setTimeout(r, 1500)); // giả lập chờ cổng thanh toán
      await api.post('/payment/simulate', { orderId: id, method });
      Alert.alert('Thanh toán thành công', 'Đơn hàng của bạn đã được ghi nhận.');
      navigation.replace('OrderDetail', { id });
    } catch (e) {
      Alert.alert('Thanh toán thất bại', errMsg(e));
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.gateway}>{name}</Text>
      <Text style={s.note}>Đây là màn hình mô phỏng, không trừ tiền thật.</Text>
      <View style={s.box}>
        <Text style={s.label}>Số tiền thanh toán</Text>
        <Text style={s.amount}>{formatVND(order.total)}</Text>
        <Text style={s.label}>Mã đơn</Text>
        <Text style={{ fontWeight: '600' }}>#{order._id.slice(-6).toUpperCase()}</Text>
      </View>
      <Button title={`Thanh toán bằng ${name}`} onPress={pay} loading={paying} />
      <Button title="Để sau, xem đơn hàng" kind="outline" onPress={() => navigation.replace('OrderDetail', { id })} style={{ marginTop: 10 }} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  gateway: { fontSize: 30, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  note: { textAlign: 'center', color: colors.muted, marginTop: 4, marginBottom: 24 },
  box: { backgroundColor: colors.bg, borderRadius: 12, padding: 18, marginBottom: 24 },
  label: { color: colors.muted, fontSize: 13, marginTop: 6 },
  amount: { fontSize: 30, fontWeight: '800', color: colors.accent },
});
