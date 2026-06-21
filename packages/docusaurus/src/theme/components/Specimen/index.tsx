import React from 'react';
import clsx from 'clsx';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';

export interface SpecimenProps {
  /** Slug of the HTML file under /static/specimen/ (without `.html`). */
  src: string;
  /** Optional caption shown under the frame. */
  title?: React.ReactNode;
  /** Frame height in pixels. Defaults to 360. */
  height?: number;
  className?: string;
}

const frameStyle = (height: number): React.CSSProperties => ({
  width: '100%',
  height,
  border: '1px solid var(--border-1)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--surface-1)',
  display: 'block',
});

const captionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--fg-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginTop: '8px',
  textAlign: 'center',
};

// Read color mode directly from <html data-theme="…"> so this component does
// not depend on `useColorMode` (which requires the ColorModeProvider React
// context — fragile across duplicated theme-common copies in pnpm workspaces).
function readTheme(): 'light' | 'dark' {
  const value = document.documentElement.getAttribute('data-theme');
  return value === 'dark' ? 'dark' : 'light';
}

function ThemedFrame({
  url,
  src,
  height,
  title,
}: {
  url: string;
  src: string;
  height: number;
  title?: React.ReactNode;
}): React.ReactElement {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => readTheme());

  React.useEffect(() => {
    setTheme(readTheme());
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <iframe
      className="kt-specimen__frame"
      src={`${url}?theme=${theme}`}
      title={typeof title === 'string' ? title : src}
      loading="lazy"
      style={frameStyle(height)}
    />
  );
}

/**
 * Embed an isolated HTML specimen from `/static/specimen/<src>.html`.
 *
 * Each specimen is a standalone HTML page in its own iframe so its inline
 * styles cannot collide with the host Docusaurus page. The current color
 * mode is forwarded via a `?theme=` query param; the specimen pages have a
 * tiny inline script (injected by `prepare-specimens.mjs`) that mirrors it
 * onto `document.documentElement.dataset.theme`.
 */
export default function Specimen({
  src,
  title,
  height = 360,
  className,
}: SpecimenProps): React.ReactElement {
  // No `.html` extension: under `docusaurus serve` + trailingSlash:false the
  // `.html` URL 301-redirects to a baseUrl-less path and bounces to the SPA
  // (the iframe would render the whole app). The clean route is served directly
  // in all environments, with relative asset paths still resolving to /specimen/.
  const url = useBaseUrl(`/specimen/${src}`);
  return (
    <figure className={clsx('kt-specimen', className)}>
      <BrowserOnly fallback={<div style={frameStyle(height)} aria-hidden="true" />}>
        {() => <ThemedFrame url={url} src={src} height={height} title={title} />}
      </BrowserOnly>
      {title ? (
        <figcaption className="kt-specimen__caption" style={captionStyle}>
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
}
