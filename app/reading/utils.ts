import { Themes } from '@epubjs-react-native/core';

const MAX_FONT_SIZE = 32;
const MIN_FONT_SIZE = 8;

const availableFonts: Array<string> = ['Helvetica', 'cursive', 'serif', 'monospace', 'Georgia', 'Times'];

const themes = Object.values(Themes);

const COLORS = ['#C20114', '#39A2AE', '#CBA135', '#23CE6B', '#090C02'];

const contrast: { [key: string]: string } = {
  '#fff': '#333',
  '#333': '#fff',
  '#e8dcb8': '#333',
};

export type Selection = {
  cfiRange: string;
  text: string;
};


export { availableFonts, COLORS, contrast, MAX_FONT_SIZE, MIN_FONT_SIZE, themes };
