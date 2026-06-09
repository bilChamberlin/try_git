import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchShow, fetchShowArtworks } from '../api/artsy';

function formatDates(start, end) {
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (!start) return '';
  return end ? `${fmt(start)} – ${fmt(end)}` : `From ${fmt(start)}`;
}

export default function DetailScreen({ route, navigation }) {
  const { show: initial } = route.params;
  const [show, setShow] = useState(initial);
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  useEffect(() => {
    fetchShow(initial.id).then(setShow).catch(() => {});
    fetchShowArtworks(initial.id)
      .then(setArtworks)
      .catch(() => {})
      .finally(() => setLoadingArtworks(false));
  }, [initial.id]);

  const image = show._links?.thumbnail?.href;
  const artsyUrl = show._links?.permalink?.href;
  const description = (show.description || show.press_release || '').replace(/<[^>]+>/g, '');
  const location = [show.location?.city, show.location?.country].filter(Boolean).join(', ');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {image
          ? <Image source={{ uri: image }} style={styles.hero} resizeMode="cover" />
          : <View style={[styles.hero, styles.heroPlaceholder]} />
        }

        <View style={styles.body}>
          <Text style={styles.status}>{show.status?.toUpperCase()}</Text>
          <Text style={styles.title}>{show.name}</Text>
          {!!show.partner?.name && <Text style={styles.partner}>{show.partner.name}</Text>}
          {!!location && <Text style={styles.meta}>{location}</Text>}
          {!!(show.start_at || show.end_at) && (
            <Text style={styles.meta}>{formatDates(show.start_at, show.end_at)}</Text>
          )}

          {!!description && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{description}</Text>
            </>
          )}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Works in this Show</Text>
          {loadingArtworks ? (
            <ActivityIndicator color="#888" style={{ marginVertical: 16 }} />
          ) : artworks.length === 0 ? (
            <Text style={styles.noArtworks}>No artworks listed.</Text>
          ) : (
            <FlatList
              data={artworks}
              horizontal
              keyExtractor={a => a.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.artwork}>
                  {item._links?.thumbnail?.href
                    ? <Image source={{ uri: item._links.thumbnail.href }} style={styles.artworkImage} resizeMode="cover" />
                    : <View style={[styles.artworkImage, styles.artworkPlaceholder]} />
                  }
                  <Text style={styles.artworkTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.artworkArtist} numberOfLines={1}>{item.artist_names}</Text>
                </View>
              )}
            />
          )}

          {!!artsyUrl && (
            <TouchableOpacity style={styles.link} onPress={() => Linking.openURL(artsyUrl)}>
              <Text style={styles.linkText}>View on Artsy →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  back: { paddingHorizontal: 16, paddingVertical: 12 },
  backText: { color: '#fff', fontSize: 16 },
  hero: { width: '100%', height: 280 },
  heroPlaceholder: { backgroundColor: '#1a1a1a' },
  body: { padding: 20 },
  status: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6, lineHeight: 30 },
  partner: { fontSize: 16, color: '#aaa', marginBottom: 4 },
  meta: { fontSize: 13, color: '#888', marginBottom: 2 },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  description: { fontSize: 14, color: '#aaa', lineHeight: 22, marginBottom: 8 },
  noArtworks: { color: '#555', fontSize: 14 },
  artwork: { width: 140, marginRight: 12 },
  artworkImage: { width: 140, height: 140, borderRadius: 8, marginBottom: 8 },
  artworkPlaceholder: { backgroundColor: '#1a1a1a' },
  artworkTitle: { fontSize: 13, color: '#ddd', fontWeight: '600' },
  artworkArtist: { fontSize: 12, color: '#888', marginTop: 2 },
  link: { marginTop: 28, paddingVertical: 14, paddingHorizontal: 20, backgroundColor: '#1a1a1a', borderRadius: 10, alignSelf: 'flex-start' },
  linkText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
