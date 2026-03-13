import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchShow, fetchShowArtworks } from '../api/artsy';

function formatDateRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (!start) return '';
  return end ? `${fmt(start)} – ${fmt(end)}` : `From ${fmt(start)}`;
}

export default function DetailScreen({ route, navigation }) {
  const { show: initialShow } = route.params;
  const [show, setShow] = useState(initialShow);
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: '' });

    // Fetch full show details and artworks in parallel
    Promise.all([
      fetchShow(initialShow.id).then(setShow).catch(() => {}),
      fetchShowArtworks(initialShow.id)
        .then(setArtworks)
        .catch(() => {})
        .finally(() => setLoadingArtworks(false)),
    ]);
  }, [initialShow.id]);

  const imageUrl = show._links?.thumbnail?.href;
  const artsyUrl = show._links?.permalink?.href;
  const description = show.description || show.press_release || '';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        {/* Back button */}
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Hero image */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.hero} resizeMode="cover" />
        ) : (
          <View style={[styles.hero, styles.heroPlaceholder]} />
        )}

        <View style={styles.body}>
          {/* Status */}
          <Text style={styles.status}>{show.status?.toUpperCase()}</Text>

          {/* Title */}
          <Text style={styles.title}>{show.name}</Text>

          {/* Gallery */}
          {!!show.partner?.name && (
            <Text style={styles.partner}>{show.partner.name}</Text>
          )}

          {/* Location */}
          {!!show.location?.city && (
            <View style={styles.row}>
              <Ionicons name="location-outline" size={14} color="#888" />
              <Text style={styles.meta}>
                {[show.location.city, show.location.country].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}

          {/* Dates */}
          {(show.start_at || show.end_at) && (
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.meta}>{formatDateRange(show.start_at, show.end_at)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Description */}
          {!!description && (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{description.replace(/<[^>]+>/g, '')}</Text>
            </>
          )}

          {/* Artworks */}
          <Text style={styles.sectionTitle}>Works in this Show</Text>
          {loadingArtworks ? (
            <ActivityIndicator color="#888" style={{ marginVertical: 16 }} />
          ) : artworks.length === 0 ? (
            <Text style={styles.noArtworks}>No artworks listed.</Text>
          ) : (
            <FlatList
              data={artworks}
              horizontal
              keyExtractor={(a) => a.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
              renderItem={({ item }) => (
                <View style={styles.artwork}>
                  {item._links?.thumbnail?.href ? (
                    <Image
                      source={{ uri: item._links.thumbnail.href }}
                      style={styles.artworkImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.artworkImage, styles.artworkPlaceholder]} />
                  )}
                  <Text style={styles.artworkTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.artworkArtist} numberOfLines={1}>
                    {item.artist_names}
                  </Text>
                </View>
              )}
            />
          )}

          {/* Artsy link */}
          {!!artsyUrl && (
            <TouchableOpacity style={styles.link} onPress={() => Linking.openURL(artsyUrl)}>
              <Text style={styles.linkText}>View on Artsy</Text>
              <Ionicons name="open-outline" size={14} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: { color: '#fff', fontSize: 16, marginLeft: 4 },
  hero: { width: '100%', height: 280 },
  heroPlaceholder: { backgroundColor: '#1a1a1a' },
  body: { padding: 20 },
  status: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 30,
  },
  partner: { fontSize: 16, color: '#aaa', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  meta: { fontSize: 13, color: '#888' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
    marginBottom: 24,
  },
  noArtworks: { color: '#555', fontSize: 14, marginBottom: 24 },
  artwork: { width: 140, marginRight: 12 },
  artworkImage: { width: 140, height: 140, borderRadius: 8, marginBottom: 8 },
  artworkPlaceholder: { backgroundColor: '#1a1a1a' },
  artworkTitle: { fontSize: 13, color: '#ddd', fontWeight: '600' },
  artworkArtist: { fontSize: 12, color: '#888', marginTop: 2 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  linkText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
