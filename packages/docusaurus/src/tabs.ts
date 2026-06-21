/**
 * Variant-tab presets for Kotlin docs — the kit's analogue of React Native's
 * `core/TabsConstants.tsx`. Feed these to Docusaurus' built-in `<Tabs>`:
 *
 * ```mdx
 * import KtTabs from '@ktdocs/docusaurus-preset/tabs';
 *
 * <Tabs groupId="gradle-dsl" queryString values={KtTabs.gradleDsl} defaultValue={KtTabs.defaultGradleDsl}>
 *   <TabItem value="kotlin">…</TabItem>
 *   <TabItem value="groovy">…</TabItem>
 * </Tabs>
 * ```
 *
 * `groupId` persists the reader's choice to `localStorage` (key
 * `docusaurus.tab.<groupId>`) and, with `queryString`, mirrors it to the URL so
 * a link can pre-select a tab.
 *
 * The OS default is intentionally SSR-stable (`defaultOs === 'linux'`): reading
 * `navigator` at module load would make SSG emit `linux` while a macOS/Windows
 * client renders a different active tab — a hydration mismatch. For genuine
 * "follow the reader's OS" behaviour, drive a *controlled* `<Tabs>` with
 * {@link useDefaultOs} (or call {@link detectOs} inside your own effect).
 */

import { useEffect, useState } from 'react';

export interface TabChoice {
  label: string;
  value: string;
}

export type OsValue = 'macos' | 'windows' | 'linux';

/** Gradle build script language. */
export const gradleDsl: TabChoice[] = [
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Groovy', value: 'groovy' },
];
export const defaultGradleDsl = 'kotlin';

/** JVM build tool. */
export const buildTool: TabChoice[] = [
  { label: 'Gradle', value: 'gradle' },
  { label: 'Maven', value: 'maven' },
];
export const defaultBuildTool = 'gradle';

/** Source language on the JVM. */
export const jvmLanguage: TabChoice[] = [
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Java', value: 'java' },
];
export const defaultJvmLanguage = 'kotlin';

/** Kotlin Multiplatform targets. */
export const kmpTargets: TabChoice[] = [
  { label: 'JVM', value: 'jvm' },
  { label: 'Android', value: 'android' },
  { label: 'iOS', value: 'ios' },
  { label: 'JS', value: 'js' },
  { label: 'Wasm', value: 'wasm' },
  { label: 'Native', value: 'native' },
];
export const defaultKmpTarget = 'jvm';

/** Host operating system. */
export const os: TabChoice[] = [
  { label: 'macOS', value: 'macos' },
  { label: 'Windows', value: 'windows' },
  { label: 'Linux', value: 'linux' },
];

/**
 * SSR-stable default OS. Server render and the client's first render must agree,
 * so this is a fixed value (no `navigator` read at module load). Safe to pass to
 * an uncontrolled `<Tabs defaultValue={KtTabs.defaultOs}>`.
 */
export const defaultOs: OsValue = 'linux';

/** Detect the reader's OS from `navigator`. Client-only; returns `linux` on the server. */
export function detectOs(): OsValue {
  if (typeof navigator === 'undefined') return 'linux';
  const ua = `${navigator.platform ?? ''} ${navigator.userAgent ?? ''}`;
  if (/Mac/i.test(ua)) return 'macos';
  if (/Win/i.test(ua)) return 'windows';
  return 'linux';
}

/**
 * OS-aware default that stays hydration-safe: returns {@link defaultOs} on the
 * server and the first client render, then the detected OS after mount. Use it
 * with a *controlled* `<Tabs value={os} onChange={setOs}>` for "follow the
 * reader's OS" behaviour without a hydration mismatch.
 */
export function useDefaultOs(): OsValue {
  const [value, setValue] = useState<OsValue>(defaultOs);
  useEffect(() => {
    setValue(detectOs());
  }, []);
  return value;
}

const KtTabs = {
  gradleDsl,
  defaultGradleDsl,
  buildTool,
  defaultBuildTool,
  jvmLanguage,
  defaultJvmLanguage,
  kmpTargets,
  defaultKmpTarget,
  os,
  defaultOs,
};

export default KtTabs;
