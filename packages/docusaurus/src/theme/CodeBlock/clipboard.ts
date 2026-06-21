/**
 * Copy `text` to the clipboard, falling back to a hidden-textarea +
 * `document.execCommand('copy')` when `navigator.clipboard` is unavailable —
 * which is the case on plain-HTTP origins and older browsers (the async
 * Clipboard API is gated to secure contexts). Rejects if neither path works, so
 * callers can keep treating copy as non-critical.
 *
 * Shared by the swizzled CodeBlock and the CodeTabs component.
 */
export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('clipboard unavailable'));
  }
  return new Promise<void>((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) resolve();
      else reject(new Error('execCommand copy failed'));
    } catch (error) {
      reject(error instanceof Error ? error : new Error('copy failed'));
    }
  });
}
