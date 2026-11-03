import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import api, { errMsg } from '../api';
import { useCart } from '../context/CartContext';
import { Button } from '../components';
import { colors, formatVND } from '../theme';

const METHODS = [
  { key: 'COD', label: 'Tiền mặt khi nhận hàng' },
  { key: 'VNPAY', label: 'VNPay (mô phỏng)' },
  { key: 'MOMO', label: 'Ví MoMo (mô phỏng)' },
];

export default function CheckoutScreen({ navigation }) {
  const { items, total, clear } = useCart();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [method, setMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!address.trim() || !phone.trim()) return Alert.alert('Thiếu thông tin', 'Nhập địa chỉ và số điện thoại giao hàng.');
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.product._id, qty: i.qty })),
        address: address.trim(),
        phone: phone.trim(),
        note: note.trim(),
        paymentMethod: method,
      });
      clear();
      // COD: xong luôn. VNPay/MoMo: sang màn thanh toán mô phỏng
      if (method === 'COD') navigation.replace('OrderDetail', { id: res.data._id });
      else navigation.replace('Payment', { id: res.data._id });
    } catch (e) {
      Alert.alert('Đặt hàng thất bại', errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={s.h}>Thông tin giao hàng</Text>
      <TextInput style={s.input} placeholder="Địa chỉ giao hàng" value={address} onChangeText={setAddress} />
      <TextInput style={s.input} placeholder="Số điện thoại" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={s.input} placeholder="Ghi chú (không bắt buộc)" value={note} onChangeText={setNote} />

      <Text style={s.h}>Phương thức thanh toán</Text>
      {METHODS.map((m) => (
        <Pressable key={m.key} onPress={() => setMethod(m.key)} style={[s.method, method === m.key && s.methodOn]}>
          <View style={[s.radio, method === m.key && s.radioOn]} />
          <Text style={{ fontSize: 15 }}>{m.label}</Text>
        </Pressable>
      ))}

      <Text style={s.h}>Đơn hàng</Text>
      {items.map((i) => (
        <View key={i.product._id} style={s.line}>
          <Text style={{ flex: 1 }}>{i.qty} × {i.product.name}</Text>
          <Text>{formatVND(i.qty * i.product.price)}</Text>
        </View>
      ))}
      <View style={[s.line, { marginTop: 8 }]}>
        <Text style={{ fontWeight: '800', fontSize: 16 }}>Tổng cộng</Text>
        <Text style={{ fontWeight: '800', fontSize: 18, color: colors.accent }}>{formatVND(total)}</Text>
      </View>

      <Button title={method === 'COD' ? 'Xác nhận đặt hàng' : 'Đặt hàng và thanh toán'} onPress={submit} loading={loading} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  h: { fontSize: 17, fontWeight: '700', marginTop: 18, marginBottom: 10, color: colors.ink },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 13, marginBottom: 10, fontSize: 16 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: colors.line, borderRadius: 10, marginBottom: 8 },
  methodOn: { borderColor: colors.accent, backgroundColor: '#fff5f5' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.muted },
  radioOn: { borderColor: colors.accent, backgroundColor: colors.accent },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
});
