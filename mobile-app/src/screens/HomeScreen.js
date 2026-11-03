import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import api, { errMsg } from '../api';
import { Empty, ErrorView, Loading } from '../components';
import { colors, formatVND } from '../theme';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await api.get('/products', { params: { search, category } });
      setProducts(res.data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, category]);

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(['Tất cả', ...r.data])).catch(() => {});
  }, []);

  // Tìm kiếm: chờ 400ms sau khi gõ xong mới gọi API
  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <View style={s.wrap}>
      <TextInput style={s.search} placeholder="Tìm món ăn..." value={search} onChangeText={setSearch} />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {categories.map((c) => (
            <Pressable key={c} onPress={() => setCategory(c)} style={[s.chip, category === c && s.chipOn]}>
              <Text style={[s.chipText, category === c && { color: '#fff' }]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} onRetry={() => { setLoading(true); load(); }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p._id}
          contentContainerStyle={{ padding: 12, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
          ListEmptyComponent={<Empty text="Không tìm thấy món nào. Thử từ khóa hoặc danh mục khác." />}
          renderItem={({ item }) => (
            <Pressable style={s.card} onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
              <Image source={{ uri: item.image }} style={s.img} />
              <View style={{ flex: 1, padding: 10 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.desc} numberOfLines={2}>{item.description}</Text>
                <Text style={s.price}>{formatVND(item.price)}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  search: { backgroundColor: '#fff', margin: 12, marginBottom: 4, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.line, fontSize: 16 },
  chips: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.ink },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  img: { width: 110, height: 110, backgroundColor: colors.line },
  name: { fontSize: 16, fontWeight: '700', color: colors.ink },
  desc: { color: colors.muted, fontSize: 13, marginTop: 2 },
  price: { color: colors.accent, fontWeight: '700', marginTop: 6, fontSize: 15 },
});
