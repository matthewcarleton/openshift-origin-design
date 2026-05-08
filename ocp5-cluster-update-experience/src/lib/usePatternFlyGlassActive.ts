import { useSyncExternalStore } from "react";
import { isPatternFlyGlassActive } from "./documentTheme";

function subscribeHtmlClassChanges(onStoreChange: () => void): () => void {
  const el = document.documentElement;
  const obs = new MutationObserver(() => onStoreChange());
  obs.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

/**
 * Re-renders when the document root glass theme toggles (masthead switch).
 * Use for PatternFly `Card isGlass` so cards match global glass mode.
 */
export function usePatternFlyGlassActive(): boolean {
  return useSyncExternalStore(
    subscribeHtmlClassChanges,
    isPatternFlyGlassActive,
    () => true
  );
}
