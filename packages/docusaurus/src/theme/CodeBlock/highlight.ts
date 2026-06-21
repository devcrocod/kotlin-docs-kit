export interface ParsedMeta {
  title?: string;
  highlightLines: Set<number>;
  showLineNumbers: boolean;
}

const TITLE_RE = /title=(?:"([^"]+)"|'([^']+)')/;
const RANGES_RE = /\{([^}]+)\}/;
const SHOW_LINENO_RE = /\bshowLineNumbers\b/;

export function parseMeta(metastring?: string): ParsedMeta {
  const result: ParsedMeta = {
    highlightLines: new Set<number>(),
    showLineNumbers: false,
  };
  if (!metastring) return result;

  const t = metastring.match(TITLE_RE);
  if (t) result.title = t[1] ?? t[2];

  const r = metastring.match(RANGES_RE);
  if (r) {
    for (const segment of r[1].split(',')) {
      const m = segment.trim().match(/^(\d+)(?:-(\d+))?$/);
      if (!m) continue;
      const start = Number.parseInt(m[1], 10);
      const end = m[2] ? Number.parseInt(m[2], 10) : start;
      for (let i = start; i <= end; i++) result.highlightLines.add(i);
    }
  }

  if (SHOW_LINENO_RE.test(metastring)) result.showLineNumbers = true;

  return result;
}

const TERMINAL_LANGS = new Set(['bash', 'shell', 'sh', 'zsh', 'console', 'terminal']);

export function isTerminalLang(lang: string | undefined): boolean {
  return !!lang && TERMINAL_LANGS.has(lang.toLowerCase());
}

const LANG_RE = /language-([\w-]+)/;

export function extractLanguage(
  className: string | undefined,
  explicit: string | undefined,
): string {
  if (explicit) return explicit;
  if (!className) return 'text';
  const m = className.match(LANG_RE);
  return m ? m[1] : 'text';
}

export function stringifyChildren(node: unknown): string {
  if (node == null || node === false || node === true) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(stringifyChildren).join('');
  if (typeof node === 'object' && 'props' in (node as Record<string, unknown>)) {
    const props = (node as { props: { children?: unknown } }).props;
    return stringifyChildren(props.children);
  }
  return '';
}
