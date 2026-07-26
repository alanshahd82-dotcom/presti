import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {
  WHATSAPP_NUMBER,
  PHONE_MOBILE,
  PHONE_LANDLINE,
  AGENCY_ADDRESS,
  AGENCY_EMAIL,
  MAPS_URL,
} from '../utils/format';

const HOURS = [
  { day: 'Lun – Ven', hours: '08h00 – 20h00', active: true },
  { day: 'Samedi',    hours: '08h00 – 18h00', active: true },
  { day: 'Dimanche',  hours: '09h00 – 14h00', active: false },
];

const QUICK_MSGS = [
  { label: '🚗  Réservation',    msg: 'Bonjour, je voudrais réserver une voiture.' },
  { label: '💰  Tarif',          msg: 'Bonjour, pouvez-vous me donner vos tarifs?' },
  { label: '📅  Disponibilité', msg: 'Bonjour, une voiture est-elle disponible pour mes dates?' },
];

export default function ContactScreen() {
  const openWhatsApp = (msg = '') => {
    const encoded = encodeURIComponent(
      msg || 'Bonjour! Je voudrais des informations sur la location de voiture.',
    );
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`);
  };

  const call = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[\s\-]/g, '')}`);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroDeco} />
        <Text style={styles.heroTitle}>Contactez-nous</Text>
        <Text style={styles.heroSub}>
          Réponse garantie en moins de 5 minutes sur WhatsApp
        </Text>
        {/* Live indicator */}
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>En ligne maintenant</Text>
        </View>
      </View>

      {/* WhatsApp CTA */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.whatsappCard}
          onPress={() => openWhatsApp()}
          activeOpacity={0.85}>
          <View style={styles.whatsappIconBox}>
            <Text style={styles.whatsappIcon}>💬</Text>
          </View>
          <View style={styles.whatsappInfo}>
            <Text style={styles.whatsappTitle}>WhatsApp</Text>
            <Text style={styles.whatsappNumber}>{PHONE_MOBILE}</Text>
            <Text style={styles.whatsappSub}>Réponse moyenne : 5 minutes</Text>
          </View>
          <View style={styles.arrowBox}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Quick messages */}
        <Text style={styles.quickLabel}>Messages rapides</Text>
        <View style={styles.quickGrid}>
          {QUICK_MSGS.map(q => (
            <TouchableOpacity
              key={q.label}
              style={styles.quickBtn}
              onPress={() => openWhatsApp(q.msg)}
              activeOpacity={0.8}>
              <Text style={styles.quickBtnText}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Phone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Téléphone</Text>
        <View style={styles.card}>
          {[
            { label: 'Mobile', number: PHONE_MOBILE, icon: '📱' },
            { label: 'Fixe',   number: PHONE_LANDLINE, icon: '☎️' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={styles.divider} />}
              <TouchableOpacity
                style={styles.phoneRow}
                onPress={() => call(item.number)}
                activeOpacity={0.8}>
                <View style={styles.phoneIcon}>
                  <Text style={styles.phoneIconText}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.phoneLabel}>{item.label}</Text>
                  <Text style={styles.phoneNumber}>{item.number}</Text>
                </View>
                <View style={styles.callChip}>
                  <Text style={styles.callChipText}>Appeler</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Location & Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre agence</Text>
        <View style={styles.card}>
          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>📍</Text>
            <View>
              <Text style={styles.address}>{AGENCY_ADDRESS}</Text>
              <Text style={styles.city}>Rabat 10040, Maroc</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.hoursTitle}>Horaires d'ouverture</Text>
          {HOURS.map(h => (
            <View key={h.day} style={styles.hourRow}>
              <Text style={styles.hourDay}>{h.day}</Text>
              <View style={[styles.hourBadge, !h.active && styles.hourBadgeClosed]}>
                <Text style={[styles.hourTime, !h.active && styles.hourTimeClosed]}>
                  {h.hours}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.mapsBtn}
            onPress={() => Linking.openURL(MAPS_URL)}
            activeOpacity={0.85}>
            <Text style={styles.mapsBtnText}>🗺  Ouvrir dans Google Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Email */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email</Text>
        <TouchableOpacity
          style={styles.emailCard}
          onPress={() =>
            Linking.openURL(
              `mailto:${AGENCY_EMAIL}?subject=Location%20voiture&body=Bonjour%2C%20`,
            )
          }
          activeOpacity={0.85}>
          <View style={styles.emailLeft}>
            <Text style={styles.emailIcon}>✉️</Text>
            <View>
              <Text style={styles.emailAddr}>{AGENCY_EMAIL}</Text>
              <Text style={styles.emailSub}>Réponse sous 24h</Text>
            </View>
          </View>
          <Text style={styles.emailArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },

  // Hero
  hero: {
    backgroundColor: '#1a2744',
    padding: 24,
    paddingTop: 28,
    paddingBottom: 30,
    overflow: 'hidden',
  },
  heroDeco: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(245,197,24,0.07)',
    top: -60,
    right: -40,
  },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 8, letterSpacing: -0.5 },
  heroSub: { color: '#94A3B8', fontSize: 14, lineHeight: 20, marginBottom: 14 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  liveText: { color: '#22C55E', fontSize: 12, fontWeight: '700' },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1a2744', marginBottom: 12, letterSpacing: -0.2 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  // WhatsApp
  whatsappCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#25D366',
    marginBottom: 14,
  },
  whatsappIconBox: {
    backgroundColor: '#DCFCE7',
    borderRadius: 14,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  whatsappIcon: { fontSize: 28 },
  whatsappInfo: { flex: 1 },
  whatsappTitle: { fontSize: 16, fontWeight: '800', color: '#1a2744', marginBottom: 2 },
  whatsappNumber: { fontSize: 14, color: '#25D366', fontWeight: '700', marginBottom: 2 },
  whatsappSub: { fontSize: 11, color: '#9CA3AF' },
  arrowBox: {
    backgroundColor: '#25D366',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { fontSize: 18, color: '#fff', fontWeight: '700' },

  quickLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickBtn: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  quickBtnText: { fontSize: 12, color: '#374151', fontWeight: '700' },

  // Phone
  phoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  phoneIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  phoneIconText: { fontSize: 20 },
  phoneLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 2, fontWeight: '600' },
  phoneNumber: { fontSize: 15, fontWeight: '800', color: '#1a2744' },
  callChip: {
    backgroundColor: '#1a2744',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  callChipText: { fontSize: 12, color: '#F5C518', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F2F5', marginVertical: 4 },

  // Address
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  addressIcon: { fontSize: 22, marginTop: 2 },
  address: { fontSize: 15, fontWeight: '700', color: '#1a2744', marginBottom: 3 },
  city: { fontSize: 13, color: '#6B7280' },

  hoursTitle: { fontSize: 13, fontWeight: '800', color: '#1a2744', marginBottom: 10 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  hourDay: { fontSize: 13, color: '#374151', fontWeight: '500' },
  hourBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  hourBadgeClosed: { backgroundColor: '#FFF7F0', borderColor: '#FED7AA' },
  hourTime: { fontSize: 12, fontWeight: '700', color: '#15803D' },
  hourTimeClosed: { color: '#C2410C' },

  mapsBtn: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  mapsBtnText: { color: '#1D4ED8', fontWeight: '800', fontSize: 14 },

  // Email
  emailCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1a2744',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  emailLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emailIcon: { fontSize: 28 },
  emailAddr: { fontSize: 14, fontWeight: '800', color: '#1a2744', marginBottom: 3 },
  emailSub: { fontSize: 12, color: '#9CA3AF' },
  emailArrow: { fontSize: 20, color: '#1a2744', fontWeight: '700' },
});
