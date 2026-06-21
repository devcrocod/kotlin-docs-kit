// Shared helpers for naming CSS variables from DTCG token paths.
//
// Two stripping rules applied to a token's `path` array:
//
//  1. If the first segment is "color" and the second is a known palette name,
//     drop "color" so `color.kt-purple.500` -> `kt-purple-500` and
//     `color.gray.500` -> `gray-500`. Gradients (kt-gradient*) follow the same
//     rule. Semantic top-level colors keep the prefix: `color.primary` stays
//     `color-primary`.
//
//  2. If the first segment is "shadow" and the second is "dark", drop "dark"
//     so `shadow.dark.xs` -> `shadow-xs`. The dark group is routed into the
//     `[data-theme="dark"]` selector block by the formatter, not by the name.

const PALETTE_SEGMENTS = new Set([
  'kt-purple',
  'kt-magenta',
  'kt-red',
  'kt-pink',
  'kt-orange',
  'kt-blue',
  'kt-teal',
  'gray',
  'green',
  'amber',
  'red',
  'cyan',
  'kt-gradient',
  'kt-gradient-linear',
  'kt-gradient-soft',
]);

export function stripColorNamespace(segments) {
  if (segments[0] === 'color' && PALETTE_SEGMENTS.has(segments[1])) {
    return segments.slice(1);
  }
  return segments;
}

export function collapseShadowDark(segments) {
  if (segments[0] === 'shadow' && segments[1] === 'dark') {
    return ['shadow', ...segments.slice(2)];
  }
  return segments;
}

export function cssNameFromPath(segments) {
  return collapseShadowDark(stripColorNamespace(segments)).join('-');
}
