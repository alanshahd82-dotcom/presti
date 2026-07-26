import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
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
  { day: 'Lundi – Vendredi', hours: '08h00 – 20h00' },
  { day: 'Samedi', hours: '08h00 – 18h00' },
  { day: 'Dimanche', hours: '09h00 – 14h00' },
];

export default function ContactScreen() {
  const openWhatsApp = (msg = '') => {
    const encoded = encodeURIComponent(msg || 'Bonjour! Je voudrais des informations sur la location de voiture.');
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`);
  };

  const call = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[\s\-]/g, '')}`);
  };

  const openMaps = () => {
    Linking.openURL(MAPS_URL);
  };

  const sendEmail = () => {
    Linking.openURL(`mailto:${AGENCY_EMAIL}?subject=Location%20voiture&body=Bonjour%2C%20`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Contactez-nous</Text>
        <Text style={styles.heroSub}>
          Notre équipe répond en moins de 5 minutes sur WhatsApp.
        </Text>
      </View>

      {/* WhatsApp - primary */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.whatsappCard} onPress={() => openWhatsApp()}>
          <View style={styles.whatsappIconBox}>
            <Text style={styles.whatsappIcon}>💬</Text>
          </View>
          <View style={styles.whatsappInfo}>
            <Text style={styles.whatsappTitle}>WhatsApp</Text>
            <Text style={styles.whatsappNumber}>{PHONE_MOBILE}</Text>
            <Text style={styles.whatsappSub}>Réponse moyenne : 5 minutes</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Quick messages */}
        <Text style={styles.quickLabel}>Messages rapides :</Text>
        <View style={styles.quickBtns}>
          {[
            { label: '🚗 Réservation', msg: 'Bonjour, je voudrais réserver une voiture.' },
            { label: '💰 Tarif', msg: 'Bonjour, pouvez-vous me donner vos tarifs?' },
            { label: '📅 Disponibilité', msg: 'Bonjour, une voiture est-elle disponible pour mes dates?' },
          ].map(q => (
            <TouchableOpacity
              key={q.label}
              style={styles.quickBtn}
              onPress={() => openWhatsApp(q.msg)}>
              <Text style={styles.quickBtnText}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Phone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Téléphone</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.phoneRow} onPress={() => call(PHONE_MOBILE)}>
            <View style={styles.phoneIcon}>
              <Text style={styles.phoneIconText}>📱</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneLabel}>Mobile</Text>
              <Text style={styles.phoneNumber}>{PHONE_MOBILE}</Text>
            </View>
            <Text style={styles.callText}>Appeler</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.phoneRow} onPress={() => call(PHONE_LANDLINE)}>
            <View style={styles.phoneIcon}>
              <Text style={styles.phoneIconText}>☎️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneLabel}>Fixe</Text>
              <Text style={styles.phoneNumber}>{PHONE_LANDLINE}</Text>
            </View>
            <Text style={styles.callText}>Appeler</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Notre agence</Text>
        <View style={styles.card}>
          <Text style={styles.address}>{AGENCY_ADDRESS}</Text>
          <Text style={styles.city}>Rabat 10040, Maroc</Text>

          <View style={styles.divider} />
          <Text style={styles.hoursTitle}>Horaires d'ouverture</Text>
          {HOURS.map(h => (
            <View key={h.day} style={styles.hourRow}>
              <Text style={styles.hourDay}>{h.day}</Text>
              <Text style={styles.hourTime}>{h.hours}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.mapsBtn} onPress={openMaps}>
            <Text style={styles.mapsBtnText}>🗺  Ouvrir dans Google Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Email */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✉️ Email</Text>
        <TouchableOpacity style={styles.emailCard} onPress={sendEmail}>
          <Text style={styles.emailAddr}>{AGENCY_EMAIL}</Text>
          <Text style={styles.emailSub}>Réponse sous 24h</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  hero: {
    backgroundColor: '#1a2744',
    padding: 24,
    paddingTop: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  heroSub: { color: '#94A3B8', fontSize: 14, lineHeight: 20 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a2744', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  whatsappCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#25D366',
    marginBottom: 12,
  },
  whatsappIconBox: {
    backgroundColor: '#DCFCE7',
    borderRadius: 14,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  whatsappIcon: { fontSize: 26 },
  whatsappInfo: { flex: 1 },
  whatsappTitle: { fontSize: 16, fontWeight: '800', color: '#1a2744' },
  whatsappNumber: { fontSize: 13, color: '#25D366', fontWeight: '600', marginVertical: 2 },
  whatsappSub: { fontSize: 11, color: '#6B7280' },
  arrow: { fontSize: 20, color: '#25D366', fontWeight: '700' },
  quickLabel: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  quickBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  quickBtnText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  phoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  phoneIconText: { fontSize: 20 },
  phoneLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 2 },
  phoneNumber: { fontSize: 15, fontWeight: '700', color: '#1a2744' },
  callText: { fontSize: 13, color: '#1a2744', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  address: { fontSize: 15, fontWeight: '600', color: '#1a2744', marginBottom: 2 },
  city: { fontSize: 13, color: '#6B7280', marginBottom: 14 },
  hoursTitle: { fontSize: 13, fontWeight: '700', color: '#1a2744', marginBottom: 8 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  hourDay: { fontSize: 13, color: '#374151' },
  hourTime: { fontSize: 13, fontWeight: '600', color: '#1a2744' },
  mapsBtn: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  mapsBtnText: { color: '#1D4ED8', fontWeight: '700', fontSize: 14 },
  emailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  emailAddr: { fontSize: 16, fontWeight: '700', color: '#1a2744', marginBottom: 4 },
  emailSub: { fontSize: 12, color: '#6B7280' },
});
