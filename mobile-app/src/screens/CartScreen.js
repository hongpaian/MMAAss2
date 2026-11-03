import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { Button, Empty } from '../components';
import { colors, formatVND } from '../theme';

export default function CartScreen({ navigation }) {
  const { items, setQty, total } = useCart();

  if (items.length === 0) return <Empty text="Giỏ hàng đang trống. Chọn vài món ở tab Thực đơn nhé." />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.product._id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={s.row}>
            <Image source={{ uri: item.product.image }} style={s.img} />
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={s.name}>{item.product.name}</Text>
              <Text style={s.price}>{formatVND(item.product.price)}</Text>
            </View>
            <View style={s.stepper}>
              <Text style={s.stepBtn} onPress={() => setQty(item.product._id, item.qty - 1)}>−</Text>
              <Text style={s.qty}>{item.qty}</Text>
              <Text style={s.stepBtn} onPress={() => setQty(item.product._id, item.qty + 1)}>+</Text>
            </View>
          </View>
        )}
      />
      <View style={s.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: 16 }}>Tạm tính</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.accent }}>{formatVND(total)}</Text>
        </View>
        <Button title="Đặt hàng" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: colors.line },
  img: { width: 60, height: 60, borderRadius: 8, backgroundColor: colors.line },
  name: { fontWeight: '700', fontSize: 15, color: colors.ink },
  price: { color: colors.muted, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: { fontSize: 22, paddingHorizontal: 10, color: colors.accent },
  qty: { minWidth: 22, textAlign: 'center', fontWeight: '600' },
  footer: { padding: 14, backgroundColor: '#fff', borderTopWidth: 1, borderColor: colors.line },
});
