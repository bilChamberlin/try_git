import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function formatDateRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (!start) return '';
  return end ? `${fmt(start)} – ${fmt(end)}` : `From ${fmt(start)}`;
}

export default function ExhibitCard({ show, onPress }) {
  const imageUrl = show._links?.thumbnail?.href;
  const location =
    show.location?.city || show.partner?.name || '';
  const dates = formatDateRange(show.start_at, show.end_at);
  const status = show.status; // 'current' | 'upcoming' | 'closed'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.row}>
          {status === 'current' && <View style={[styles.badge, styles.badgeCurrent]} />}
          {status === 'upcoming' && <View style={[styles.badge, styles.badgeUpcoming]} />}
          <Text style={styles.status}>{status?.toUpperCase()}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>{show.name}</Text>
        {!!show.partner?.name && (
          <Text style={styles.partner}>{show.partner.name}</Text>
        )}
        {!!location && <Text style={styles.location}>{location}</Text>}
        {!!dates && <Text style={styles.dates}>{dates}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#555',
    fontSize: 13,
  },
  body: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeCurrent: { backgroundColor: '#4ade80' },
  badgeUpcoming: { backgroundColor: '#facc15' },
  status: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  partner: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: '#777',
    marginBottom: 2,
  },
  dates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
