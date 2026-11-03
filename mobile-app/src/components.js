import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';

export function Button({ title, onPress, loading, kind = 'primary', disabled, style }) {
  const outline = kind === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[s.btn, outline && s.btnOutline, (disabled || loading) && { opacity: 0.6 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.accent : '#fff'} />
      ) : (
        <Text style={[s.btnText, outline && { color: colors.accent }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Loading() {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={s.center}>
      <Text style={s.errText}>{message}</Text>
      {onRetry && <Button title="Thử lại" onPress={onRetry} kind="outline" style={{ marginTop: 12, minWidth: 140 }} />}
    </View>
  );
}

export function Empty({ text }) {
  return (
    <View style={s.center}>
      <Text style={{ color: colors.muted, textAlign: 'center' }}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  btn: { backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.accent },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errText: { color: colors.accent, textAlign: 'center', fontSize: 15 },
});
