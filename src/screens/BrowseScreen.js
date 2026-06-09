import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExhibitCard from '../components/ExhibitCard';
import { fetchShows } from '../api/artsy';

const TABS = ['current', 'upcoming'];

export default function BrowseScreen({ navigation }) {
  const [tab, setTab] = useState('current');
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (status, pageNum, replace = false) => {
    try {
      const results = await fetchShows({ status, page: pageNum });
      setShows(prev => replace ? results : [...prev, ...results]);
      setHasMore(results.length === 20);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setShows([]);
    setPage(1);
    setError(null);
    load(tab, 1, true).finally(() => setLoading(false));
  }, [tab]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await load(tab, 1, true);
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    setPage(next);
    await load(tab, next);
    setLoadingMore(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Exhibits</Text>
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator style={styles.center} color="#fff" />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.retry}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={shows}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExhibitCard show={item} onPress={() => navigation.navigate('Detail', { show: item })} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#888" style={{ marginVertical: 16 }} /> : null}
          ListEmptyComponent={<Text style={styles.empty}>No exhibits found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { fontSize: 28, fontWeight: '800', color: '#fff', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a1a' },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#888', fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: '#000' },
  list: { paddingTop: 4, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#f87171', fontSize: 15, textAlign: 'center', marginHorizontal: 24 },
  retry: { color: '#fff', marginTop: 12, fontSize: 14, textDecorationLine: 'underline' },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 15 },
});
