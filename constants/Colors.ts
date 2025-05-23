/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#3366aa';
const tintColorDark = '#e9532e';

export const Colors = {
  light: {
    text: '#11181C',
    subtext: '#687076',
    textInverted: '#fff',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#5c5c5c',
    tabIconSelected: tintColorLight,
    border: '#ECEDEE',
  },
  dark: {
    text: '#ECEDEE',
    subtext: '#878792',
    textInverted: '#fff',
    background: '#17121b',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#5c5c5c',
    tabIconSelected: tintColorDark,
    border: '#333333',
  },
};
