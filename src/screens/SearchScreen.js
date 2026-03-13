import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchShows } from '../api/artsy';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  const search = async (q) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await searchShows(q);
      setResults(res);
      setSearched(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangeText = (text) => {
    setQuery(text);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => search(text), 400);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Search</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" style={styles.icon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search exhibits, galleries…"
          placeholderTextColor="#555"
          value={query}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={() => { Keyboard.dismiss(); search(query); }}
          autoCapitalize="none"
        />
        {!!query && (
          <TouchableOpacity onPress={clear}>
            <Ionicons name="close-circle" size={18} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {loading && <ActivityIndicator color="#fff" style={{ marginTop: 24 }} />}

      {!!error && <Text style={styles.error}>{error}</Text>}

      {!loading && searched && results.length === 0 && (
        <Text style={styles.empty}>No results for "{query}"</Text>
      )}

      {!loading && !searched && !query && (
        <Text style={styles.hint}>Search for exhibitions, galleries, or artists</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.result}
            onPress={() => {
              // Search results are stubs — navigate with what we have
              navigation.navigate('Browse', {
                screen: 'Detail',
                params: { show: { id: item._links?.self?.href?.split('/').pop(), name: item.title } },
              });
            }}
          >
            <Ionicons name="easel-outline" size={18} color="#555" style={styles.resultIcon} />
            <View style={styles.resultBody}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              {!!item.description && (
                <Text style={styles.resultSub} numberOfLines={1}>{item.description}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={16} color="#444" />
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  resultIcon: { marginRight: 14 },
  resultBody: { flex: 1 },
  resultTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  resultSub: { color: '#666', fontSize: 12, marginTop: 2 },
  empty: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 15 },
  hint: { color: '#444', textAlign: 'center', marginTop: 40, fontSize: 14 },
  error: { color: '#f87171', textAlign: 'center', marginTop: 20, fontSize: 14 },
});
