import path from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';

export default function ktdocsThemeShim(_context: LoadContext): Plugin<void> {
  return {
    name: 'ktdocs-theme',
    getThemePath() {
      return path.join(__dirname, 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, '..', 'src', 'theme');
    },
  };
}
