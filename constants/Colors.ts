/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary: '#0a7ea4',
    text: '#11181C',
    secondaryText: '#666666',
    background: '#fff',
    inputBackground: '#F9F9F9',
    error: '#FF3B30',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    placeholder: '#8E8E93',
    shadow: '#000000',
    border: '#38383A',
  },
  dark: {
    primary: '#0a7ea4',
    text: '#ECEDEE',
    secondaryText: '#8E8E93',
    background: '#151718',
    inputBackground: '#2C2C2E',
    error: '#FF453A',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    placeholder: '#636366',
    shadow: '#000000',
    border: '#38383A',
  },
};
