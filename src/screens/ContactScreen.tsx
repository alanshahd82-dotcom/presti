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
import { useTheme } from '../context/ThemeContext';
import { WhatsAppIcon, PhoneIcon, MapPinIcon, ShieldIcon, ZapIcon } from '../components/Icons';

const HOURS = [
  { day: 'Lun – Ven', hours: '08h00 – 20h00', active: true },
  { day: 'Samedi',    hours: '08h00 – 18h00', active: true },
  { day: 'Dimanche',  hours: '09h00 – 14h00', active: false },
];

const QUICK_MSGS = [
  { label: 'Réservation',    msg: 'Bonjour, je voudrais réserver une voiture.' },
  { label: 'Tarif',          msg: 'Bonjour, pouvez-vous me donner vos tarifs?' },
  { label: 'Disponibilité',  msg: 'Bonjour, une voiture est-elle disponible pour mes dates?' },
];

export default function ContactScreen() {
  const { colors } = useTheme();

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
      style={[styles.container, { backgroundColor: colors.bg }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroDeco} />
        <Text style={styles.heroTitle}>Contactez-nous</Text>
        <Text style={styles.heroSub}>
          Réponse garantie en moins de 5 minutes sur WhatsApp
        </Text>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>En ligne maintenant</Text>
        </View>
      </View>

      {/* WhatsApp CTA */}
      <View style={[styles.section, styles.sectionPad]}>
        <TouchableOpacity
          style={styles.whatsappCard}
          onPress={() => openWhatsApp()}
          activeOpacity={0.85}>
          <View style={styles.whatsappIconBox}>
            <WhatsAppIcon size={32} color="#fff" />
          </View>
          <View style={styles.whatsappInfo}>
            <Text style={styles.whatsappTitle}>WhatsApp</Text>
            <Text style={styles.whatsappNumber}>{PHONE_MOBILE}</Text>
            <Text style={styles.whatsappSub}>Réponse moyenne : 5 minutes</Text>
          </View>
          <View style={styles.arrowBox}>
            <ZapIcon size={20} color="#fff" strokeWidth={2} />
          </View>
        </TouchableOpacity>

        {/* Quick messages */}
        <Text style={[styles.quickLabel, { color: colors.textSub }]}>Messages rapides</Text>
        <View style={styles.quickGrid}>
          {QUICK_MSGS.map(q => (
            <TouchableOpacity
              key={q.label}
              style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => openWhatsApp(q.msg)}
              activeOpacity={0.8}>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Phone */}
      <View style={[styles.section, styles.sectionPad]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Téléphone</Text>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          {[
            { label: 'Mobile', number: PHONE_MOBILE },
            { label: 'Fixe',   number: PHONE_LANDLINE },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <TouchableOpacity
                style={styles.phoneRow}
                onPress={() => call(item.number)}
                activeOpacity={0.8}>
                <View style={[styles.phoneIconWrap, { backgroundColor: colors.primary + '14' }]}>
                  <PhoneIcon size={20} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.phoneLabel, { color: colors.textMuted }]}>{item.label}</Text>
                  <Text style={[styles.phoneNumber, { color: colors.text }]}>{item.number}</Text>
                </View>
                <View style={[styles.callBadge, { backgroundColor: '#25D36618' }]}>
                  <Text style={styles.callBadgeText}>Appeler</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Location & Hours */}
      <View style={[styles.section, styles.sectionPad]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Agence & Horaires</Text>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          {/* Address */}
          <View style={styles.addressRow}>
            <MapPinIcon size={24} color="#F5C518" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.address, { color: colors.text }]}>{AGENCY_ADDRESS}</Text>
              <Text style={[styles.city, { color: colors.textMuted }]}>Rabat, Maroc</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Hours */}
          <Text style={[styles.hoursTitle, { color: colors.text }]}>Horaires d'ouverture</Text>
          {HOURS.map(h => (
            <View key={h.day} style={styles.hourRow}>
              <Text style={[styles.hourDay, { color: colors.textSub }]}>{h.day}</Text>
              <View style={[styles.hourBadge, !h.active && styles.hourBadgeClosed]}>
                <Text style={[styles.hourTime, !h.active && styles.hourTimeClosed]}>
                  {h.hours}
                </Text>
              </View>
            </View>
          ))}

          {/* Maps button */}
          <TouchableOpacity
            style={[styles.mapsBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            onPress={() => Linking.openURL(MAPS_URL)}
            activeOpacity={0.8}>
            <MapPinIcon size={16} color="#1D4ED8" />
            <Text style={styles.mapsBtnText}> Ouvrir dans Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Email */}
      <View style={[styles.section, styles.sectionPad]}>
        <TouchableOpacity
          style={[styles.emailCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
          onPress={() => Linking.openURL(`mailto:${AGENCY_EMAIL}`)}
          activeOpacity={0.8}>
          <View style={styles.emailLeft}>
            <View style={[styles.emailIconWrap, { backgroundColor: '#3B82F614' }]}>
              <ShieldIcon size={22} color="#3B82F6" strokeWidth={2} />
            </View>
            <View>
              <Text style={[styles.emailAddr, { color: colors.text }]}>{AGENCY_EMAIL}</Text>
              <Text style={[styles.emailSub, { color: colors.textMuted }]}>Email professionnel</Text>
            </View>
          </View>
          <Text style={[styles.emailArrow, { color: colors.text }]}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionPad: { paddingHorizontal: 16 },

  // Hero
  hero: {
    backgroundColor: '#1a2744',
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 24,
    marginBottom: 4,
    overflow: 'hidden',
  },
  heroDeco: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(245,197,24,0.05)',
    right: -40,
    top: -40,
  },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 8 },
  heroSub: { fontSize: 14, color: '#94A3B8', lineHeight: 22, marginBottom: 16 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E',
  },
  liveText: { fontSize: 13, color: '#22C55E', fontWeight: '600' },

  // WhatsApp
  section: { marginTop: 20 },
  whatsappCard: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    gap: 14,
  },
  whatsappIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappInfo: { flex: 1 },
  whatsappTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 2 },
  whatsappNumber: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: 2 },
  whatsappSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  arrowBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Quick messages
  quickLabel: { fontSize: 13, fontWeight: '600', marginTop: 18, marginBottom: 10 },
  quickGrid: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  quickBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickBtnText: { fontSize: 13, fontWeight: '600' },

  // Card
  card: {
    borderRadius: 20,
    padding: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  divider: { height: 1, marginVertical: 12 },

  // Phone
  phoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, gap: 12 },
  phoneIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  phoneLabel: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
  phoneNumber: { fontSize: 15, fontWeight: '800' },
  callBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  callBadgeText: { fontSize: 12, fontWeight: '700', color: '#15803D' },

  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },

  // Address
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  address: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  city: { fontSize: 13 },

  // Hours
  hoursTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  hourDay: { fontSize: 13, fontWeight: '500' },
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
    marginTop: 12,
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mapsBtnText: { color: '#1D4ED8', fontWeight: '800', fontSize: 14 },

  // Email
  emailCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  emailLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emailIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emailAddr: { fontSize: 14, fontWeight: '800', marginBottom: 3 },
  emailSub: { fontSize: 12 },
  emailArrow: { fontSize: 20, fontWeight: '700' },
});
