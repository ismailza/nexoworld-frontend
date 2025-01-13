import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Coin } from '@/types/coin.types';

interface NexoMarkerProps {
  coin: Coin;
  size?: number;
}

const NEXO_ICONS = {
  COMMON: require('@/assets/icons/nexos/common.svg'),
  RARE: require('@/assets/icons/nexos/rare.svg'),
  EPIC: require('@/assets/icons/nexos/epic.svg'),
  LEGENDARY: require('@/assets/icons/nexos/legendary.svg'),
};

const NEXO_SIZES = {
  COMMON: 35,
  RARE: 40,
  EPIC: 45,
  LEGENDARY: 50,
};

export function NexoMarker({ coin, size = 0 }: NexoMarkerProps) {
  const nexoSize = size || NEXO_SIZES[coin.type as keyof typeof NEXO_SIZES] || NEXO_SIZES.COMMON;

  return (
    <Image
      source={NEXO_ICONS[coin.type as keyof typeof NEXO_ICONS] || NEXO_ICONS.COMMON}
      style={[
        styles.nexoIcon,
        {
          width: nexoSize,
          height: nexoSize,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  nexoIcon: {
    resizeMode: 'contain',
  },
});