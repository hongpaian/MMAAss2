import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import api, { errMsg } from '../api';
import { useCart } from '../context/CartContext';
import { Button, ErrorView, Loading } from '../components';
import { colors, formatVND } from '../theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    api.get(`/products/${route.params.id}`).then((r) => setProduct(r.data)).catch((e) => setError(errMsg(e)));
  };
  useEffect(load, []);

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!product) return <Loading />;

  const addToCart = () => {
    add(product, qty);
    Alert.alert('Đã thêm vào giỏ', `${qty} × ${product.name}`, [
      { text: 'Tiếp tục chọn món', onPress: () => navigation.goBack() },
      { text: 'Xem giỏ hàng', onPress: () => navigation.navigate('Tabs', { screen: 'Cart' }) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <Image source={{ uri: product.image }} style={s.img} />
        <View style={{ padding: 16 }}>
          <Text style={s.cat}>{product.category}</Text>
          <Text style={s.name}>{product.name}</Text>
          <Text style={s.price}>{formatVND(product.price)}</Text>
          <Text style={s.desc}>{product.description}</Text>
        </View>
      </ScrollView>
      <View style={s.footer}>
        <View style={s.stepper}>
          <Text style={s.stepBtn} onPress={() => setQty(Math.max(1, qty - 1))}>−</Text>
          <Text style={s.qty}>{qty}</Text>
          <Text style={s.stepBtn} onPress={() => setQty(qty + 1)}>+</Text>
        </View>
        <Button title={`Thêm vào giỏ · ${formatVND(product.price * qty)}`} onPress={addToCart} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  img: { width: '100%', height: 240, backgroundColor: colors.line },
  cat: { color: colors.muted, fontSize: 13 },
  name: { fontSize: 24, fontWeight: '800', color: colors.ink, marginTop: 2 },
  price: { fontSize: 20, color: colors.accent, fontWeight: '700', marginVertical: 8 },
  desc: { fontSize: 15, color: colors.ink, lineHeight: 22 },
  footer: { flexDirection: 'row', gap: 12, padding: 14, borderTopWidth: 1, borderColor: colors.line, alignItems: 'center' },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  stepBtn: { fontSize: 24, paddingHorizontal: 14, paddingVertical: 4, color: colors.accent },
  qty: { fontSize: 17, minWidth: 24, textAlign: 'center', fontWeight: '600' },
});
