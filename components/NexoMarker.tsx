import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Coin } from '@/types/coin.types';

interface NexoMarkerProps {
  coin: Coin;
  size?: number;
}

const NEXO_ICONS = {
  COMMON: require('@/assets/icons/nexos/common.png'),
  RARE: require('@/assets/icons/nexos/rare.png'),
  EPIC: require('@/assets/icons/nexos/epic.png'),
  LEGENDARY: require('@/assets/icons/nexos/legendary.png'),
};

const NEXO_SIZES = {
  COMMON: 32,
  RARE: 35,
  EPIC: 37,
  LEGENDARY: 40,
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