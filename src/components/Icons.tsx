/**
 * Pure React Native icon components — no native dependencies.
 * All icons are rendered using View, Text, and StyleSheet only.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function IconRoot({
  size,
  children,
  style,
}: {
  size: number;
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {children}
    </View>
  );
}

function IconText({
  char,
  size,
  color,
}: {
  char: string;
  size: number;
  color: string;
}) {
  return (
    <Text style={{ fontSize: size, color, lineHeight: size * 1.2, textAlign: 'center', includeFontPadding: false }}>
      {char}
    </Text>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

export function HomeIcon({ size = 24, color = '#1a2744' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s}>
      {/* Roof */}
      <View style={{
        position: 'absolute',
        top: s * 0.04,
        borderLeftWidth: s * 0.5,
        borderRightWidth: s * 0.5,
        borderBottomWidth: s * 0.38,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }} />
      {/* Body */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.04,
        width: s * 0.64,
        height: s * 0.44,
        backgroundColor: color,
        borderRadius: 1,
      }}>
        {/* Door */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          width: s * 0.24,
          height: s * 0.26,
          backgroundColor: 'rgba(255,255,255,0.35)',
          borderRadius: 1,
        }} />
      </View>
    </IconRoot>
  );
}

export function CarIcon({ size = 24, color = '#1a2744' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s}>
      {/* Car body */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.18,
        width: s * 0.88,
        height: s * 0.34,
        backgroundColor: color,
        borderRadius: s * 0.06,
      }} />
      {/* Car roof */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.48,
        width: s * 0.56,
        height: s * 0.24,
        backgroundColor: color,
        borderTopLeftRadius: s * 0.1,
        borderTopRightRadius: s * 0.1,
      }} />
      {/* Wheel left */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.04,
        left: s * 0.1,
        width: s * 0.22,
        height: s * 0.22,
        borderRadius: s * 0.11,
        borderWidth: s * 0.04,
        borderColor: color,
        backgroundColor: 'transparent',
      }} />
      {/* Wheel right */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.04,
        right: s * 0.1,
        width: s * 0.22,
        height: s * 0.22,
        borderRadius: s * 0.11,
        borderWidth: s * 0.04,
        borderColor: color,
        backgroundColor: 'transparent',
      }} />
    </IconRoot>
  );
}

export function HeartIcon({ size = 24, color = '#D1D5DB', filled = false }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.9,
        color: color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {filled ? '♥' : '♡'}
      </Text>
    </IconRoot>
  );
}

export function PhoneIcon({ size = 24, color = '#1a2744' }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.82,
        color,
        lineHeight: size,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {'✆'}
      </Text>
    </IconRoot>
  );
}

export function SearchIcon({ size = 24, color = '#6B7280' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s}>
      {/* Circle */}
      <View style={{
        position: 'absolute',
        top: s * 0.04,
        left: s * 0.04,
        width: s * 0.62,
        height: s * 0.62,
        borderRadius: s * 0.31,
        borderWidth: s * 0.09,
        borderColor: color,
        backgroundColor: 'transparent',
      }} />
      {/* Handle */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.04,
        right: s * 0.04,
        width: s * 0.08,
        height: s * 0.34,
        backgroundColor: color,
        borderRadius: s * 0.04,
        transform: [{ rotate: '-45deg' }],
      }} />
    </IconRoot>
  );
}

export function StarIcon({ size = 24, color = '#F5C518', filled = true }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.88,
        color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {filled ? '★' : '☆'}
      </Text>
    </IconRoot>
  );
}

export function SunIcon({ size = 24, color = '#F5C518' }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.88,
        color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {'☀'}
      </Text>
    </IconRoot>
  );
}

export function MoonIcon({ size = 24, color = '#94A3B8' }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.82,
        color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {'☽'}
      </Text>
    </IconRoot>
  );
}

export function ChevronRightIcon({ size = 24, color = '#1a2744' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s}>
      <View style={{
        width: s * 0.32,
        height: s * 0.32,
        borderTopWidth: s * 0.09,
        borderRightWidth: s * 0.09,
        borderTopColor: color,
        borderRightColor: color,
        transform: [{ rotate: '45deg' }],
        marginLeft: -s * 0.1,
      }} />
    </IconRoot>
  );
}

export function MapPinIcon({ size = 24, color = '#F5C518' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s}>
      {/* Pin head */}
      <View style={{
        position: 'absolute',
        top: 0,
        width: s * 0.56,
        height: s * 0.56,
        borderRadius: s * 0.28,
        borderWidth: s * 0.1,
        borderColor: color,
        backgroundColor: 'transparent',
      }} />
      {/* Pin tail */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.08,
        width: s * 0.08,
        height: s * 0.32,
        backgroundColor: color,
        borderRadius: s * 0.04,
      }} />
    </IconRoot>
  );
}

export function ShieldIcon({ size = 24, color = '#22C55E' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s}>
      {/* Shield body */}
      <View style={{
        position: 'absolute',
        top: s * 0.04,
        width: s * 0.72,
        height: s * 0.58,
        borderWidth: s * 0.08,
        borderColor: color,
        borderRadius: s * 0.08,
        backgroundColor: 'transparent',
      }} />
      {/* Shield bottom point */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.08,
        borderLeftWidth: s * 0.18,
        borderRightWidth: s * 0.18,
        borderTopWidth: s * 0.22,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      }} />
    </IconRoot>
  );
}

export function ZapIcon({ size = 24, color = '#F5C518' }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.84,
        color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {'⚡'}
      </Text>
    </IconRoot>
  );
}

export function FilterIcon({ size = 24, color = '#1a2744' }: IconProps) {
  const s = size;
  const h = s * 0.08;
  const gap = s * 0.2;
  return (
    <IconRoot size={s}>
      {[-gap, 0, gap].map((offset, i) => (
        <View key={i} style={{
          position: 'absolute',
          top: s * 0.5 + offset - h / 2,
          width: [s * 0.88, s * 0.62, s * 0.38][i],
          height: h,
          borderRadius: h / 2,
          backgroundColor: color,
        }} />
      ))}
    </IconRoot>
  );
}

export function WhatsAppIcon({ size = 24, color = '#25D366' }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.88,
        color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {'✉'}
      </Text>
    </IconRoot>
  );
}

export function GearIcon({ size = 24, color = '#6B7280' }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.88,
        color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {'⚙'}
      </Text>
    </IconRoot>
  );
}

export function UsersIcon({ size = 24, color = '#6B7280' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s}>
      {/* Head */}
      <View style={{
        position: 'absolute',
        top: s * 0.06,
        width: s * 0.32,
        height: s * 0.32,
        borderRadius: s * 0.16,
        borderWidth: s * 0.08,
        borderColor: color,
        backgroundColor: 'transparent',
      }} />
      {/* Body */}
      <View style={{
        position: 'absolute',
        bottom: s * 0.06,
        width: s * 0.6,
        height: s * 0.28,
        borderTopLeftRadius: s * 0.12,
        borderTopRightRadius: s * 0.12,
        borderWidth: s * 0.08,
        borderColor: color,
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      }} />
    </IconRoot>
  );
}

export function CheckCircleIcon({ size = 24, color = '#22C55E' }: IconProps) {
  return (
    <IconRoot size={size}>
      <Text style={{
        fontSize: size * 0.88,
        color,
        lineHeight: size * 1.0,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {'✓'}
      </Text>
    </IconRoot>
  );
}

export function ArrowRightIcon({ size = 24, color = '#1a2744' }: IconProps) {
  const s = size;
  return (
    <IconRoot size={s} style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* Shaft */}
      <View style={{
        position: 'absolute',
        left: s * 0.06,
        width: s * 0.72,
        height: s * 0.08,
        borderRadius: s * 0.04,
        backgroundColor: color,
      }} />
      {/* Arrowhead */}
      <View style={{
        position: 'absolute',
        right: s * 0.06,
        width: s * 0.3,
        height: s * 0.3,
        borderTopWidth: s * 0.08,
        borderRightWidth: s * 0.08,
        borderTopColor: color,
        borderRightColor: color,
        transform: [{ rotate: '45deg' }],
      }} />
    </IconRoot>
  );
}
