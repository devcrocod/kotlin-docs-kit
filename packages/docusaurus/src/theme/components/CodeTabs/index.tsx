import React, { useCallback, useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import { CodeIcon } from '../../CodeBlock/icons';
import { copyToClipboard } from '../../CodeBlock/clipboard';

const EMPTY_THEME: PrismTheme = { plain: {}, styles: [] };

export interface CodeTabItem {
  label: React.ReactNode;
  language?: string;
  code: string;
  showLineNumbers?: boolean;
}

export interface CodeTabsProps {
  items: CodeTabItem[];
  defaultIndex?: number;
  className?: string;
}

/**
 * Premium multi-file code block. Renders one `.kt-codeblock` host with a
 * `.kt-codeblock__tabs` header; switching tabs swaps the highlighted body.
 *
 * Use `<Tabs>` / `<TabItem>` for content tabs (prose, mixed media). Use this
 * component when each tab is a code snippet that should share a single
 * border and live behind a single copy button.
 */
export default function CodeTabs({
  items,
  defaultIndex = 0,
  className,
}: CodeTabsProps): React.ReactElement | null {
  const [active, setActive] = useState(Math.max(0, Math.min(defaultIndex, items.length - 1)));
  const [copied, setCopied] = useState(false);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = items[active];

  const onCopy = useCallback(() => {
    if (!current) return;
    copyToClipboard(current.code)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {
        // Silent failure.
      });
  }, [current]);

  if (!current) return null;

  const panelId = `${baseId}-panel`;
  const tabId = (idx: number): string => `${baseId}-tab-${idx}`;

  // WAI-ARIA tabs keyboard model: arrows move and activate, Home/End jump.
  const onTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    let next = active;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (active + 1) % items.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (active - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={clsx('kt-codeblock', className)}>
      <div className="kt-codeblock__header">
        <div className="kt-codeblock__tabs" role="tablist" onKeyDown={onTabsKeyDown}>
          {items.map((item, idx) => (
            <button
              key={idx}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              id={tabId(idx)}
              aria-selected={idx === active}
              aria-controls={panelId}
              tabIndex={idx === active ? 0 : -1}
              className={clsx('kt-codeblock__tab', idx === active && 'kt-codeblock__tab--active')}
              onClick={() => setActive(idx)}
            >
              <CodeIcon name="file" className="kt-codeblock__file-icon" />
              {item.label}
            </button>
          ))}
        </div>
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
      <Highlight
        code={current.code.replace(/\n$/, '')}
        language={current.language ?? 'text'}
        theme={EMPTY_THEME}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            className="kt-codeblock__body"
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId(active)}
            tabIndex={0}
          >
            <code>
              {tokens.map((line, i) => {
                const lineNo = i + 1;
                const lineProps = getLineProps({ line });
                const { key: _lineKey, className: lineCls, ...lineRest } = lineProps;
                return (
                  <span key={i} {...lineRest} className={clsx('kt-codeblock__line', lineCls)}>
                    {current.showLineNumbers ? (
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
