import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function formatDates(start, end) {
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (!start) return '';
  return end ? `${fmt(start)} – ${fmt(end)}` : `From ${fmt(start)}`;
}

export default function ExhibitCard({ show, onPress }) {
  const image = show._links?.thumbnail?.href;
  const dates = formatDates(show.start_at, show.end_at);
  const isCurrent = show.status === 'current';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {image
        ? <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        : <View style={[styles.image, styles.noImage]} />
      }
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={[styles.dot, isCurrent ? styles.dotGreen : styles.dotYellow]} />
          <Text style={styles.status}>{show.status?.toUpperCase()}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>{show.name}</Text>
        {!!show.partner?.name && <Text style={styles.sub}>{show.partner.name}</Text>}
        {!!show.location?.city && <Text style={styles.sub}>{show.location.city}</Text>}
        {!!dates && <Text style={styles.dates}>{dates}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden' },
  image: { width: '100%', height: 200 },
  noImage: { backgroundColor: '#2a2a2a' },
  body: { padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dotGreen: { backgroundColor: '#4ade80' },
  dotYellow: { backgroundColor: '#facc15' },
  status: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 1 },
  name: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 4 },
  sub: { fontSize: 13, color: '#888', marginBottom: 2 },
  dates: { fontSize: 12, color: '#666', marginTop: 4 },
});
