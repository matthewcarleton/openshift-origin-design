/**
 * Resolved body font stack from PatternFly (via computed styles on `body`).
 * Use for chart/canvas libraries that need a font-family string, not CSS variables.
 */
export function getPatternFlyBodyFontFamily(): string {
  if (typeof document === 'undefined') {
    return '"Red Hat Text", "RedHatText", "Helvetica Neue", Helvetica, Arial, sans-serif';
  }
  const resolved = getComputedStyle(document.body).fontFamily;
  return resolved?.trim()
    ? resolved
    : '"Red Hat Text", "RedHatText", "Helvetica Neue", Helvetica, Arial, sans-serif';
}
