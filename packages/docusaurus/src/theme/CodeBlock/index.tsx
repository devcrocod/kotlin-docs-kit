import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import type { Props } from '@theme/CodeBlock';
import { parseMeta, isTerminalLang, extractLanguage, stringifyChildren } from './highlight';
import { CodeIcon } from './icons';
import { copyToClipboard } from './clipboard';

const EMPTY_THEME: PrismTheme = { plain: {}, styles: [] };

/**
 * Premium CodeBlock implementing the BEM contract from components.md.
 *
 * - Emits `.kt-codeblock` host with `__header`, `__body`, `__line`, `__lineno`,
 *   `__code` element classes.
 * - Parses Docusaurus-style metastring (`title="App.kt" {1,3-5} showLineNumbers`).
 * - Recognises terminal languages (bash / shell / console / terminal) and
 *   applies the `.kt-codeblock--terminal` modifier.
 * - Uses an empty Prism theme: colours come from `.prism-code .token.*` rules
 *   in custom.css that map to `--code-*` tokens, keeping a single colour
 *   source of truth in `@ktdocs/tokens`.
 */
export default function CodeBlock(props: Props): React.ReactElement {
  const { children, className, metastring, title, language, showLineNumbers } = props;

  const code = stringifyChildren(children).replace(/\n$/, '');
  const lang = extractLanguage(className, language);
  const meta = parseMeta(metastring);
  const terminal = isTerminalLang(lang);

  const effectiveTitle = typeof title === 'string' && title.length > 0 ? title : meta.title;
  const effectiveShowLineNumbers =
    typeof showLineNumbers === 'boolean'
      ? showLineNumbers
      : typeof showLineNumbers === 'number'
        ? showLineNumbers > 0
        : meta.showLineNumbers;

  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    copyToClipboard(code)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {
        // Silent: copy is non-critical, never block user flow on it.
      });
  }, [code]);

  return (
    <div className={clsx('kt-codeblock', terminal && 'kt-codeblock--terminal')}>
      <div className="kt-codeblock__header">
        {effectiveTitle ? (
          <div className="kt-codeblock__tabs">
            <button
              type="button"
              className="kt-codeblock__tab kt-codeblock__tab--active"
              aria-current="true"
            >
              <CodeIcon name="file" className="kt-codeblock__file-icon" />
              {effectiveTitle}
            </button>
          </div>
        ) : (
          <span className="kt-codeblock__lang">
            <CodeIcon name={terminal ? 'terminal' : 'code'} />
            {lang}
          </span>
        )}
        <div className="kt-codeblock__actions">
          <button
            type="button"
            className="kt-codeblock__action-btn"
            onClick={onCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            <CodeIcon name="copy" />
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      </div>
      <Highlight code={code} language={lang} theme={EMPTY_THEME}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="kt-codeblock__body">
            <code>
              {tokens.map((line, i) => {
                const lineNo = i + 1;
                const hl = meta.highlightLines.has(lineNo);
                const lineProps = getLineProps({ line });
                const { key: _lineKey, className: lineCls, ...lineRest } = lineProps;
                return (
                  <span
                    key={i}
                    {...lineRest}
                    className={clsx('kt-codeblock__line', hl && 'kt-codeblock__line--hl', lineCls)}
                  >
                    {effectiveShowLineNumbers ? (
                      <span className="kt-codeblock__lineno">{lineNo}</span>
                    ) : null}
                    <span className="kt-codeblock__code">
                      {line.map((token, j) => {
                        const tokenProps = getTokenProps({ token });
                        const { key: _tokenKey, ...tokenRest } = tokenProps;
                        return <span key={j} {...tokenRest} />;
                      })}
                    </span>
                  </span>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
