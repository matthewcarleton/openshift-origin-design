/**
 * PatternFly 6 theme classes on <html>. Tailwind `dark` is kept in sync for app shell utilities.
 * Red Hat theme uses Red Hat brand tokens (vs. default / “unified” palette).
 * @see https://www.patternfly.org/
 */
export const PF_THEME_REDHAT_CLASS = "pf-v6-theme-redhat";
export const PF_THEME_DARK_CLASS = "pf-v6-theme-dark";
export const PF_THEME_GLASS_CLASS = "pf-v6-theme-glass";

const STORAGE_KEY = "ocp5-cluster-update-experience:theme";

export type ThemePreferences = {
  dark: boolean;
  glass: boolean;
};

const DEFAULT_PREFERENCES: ThemePreferences = {
  dark: true,
  glass: true,
};

export function readThemePreferences(): ThemePreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<ThemePreferences>;
    return {
      dark: typeof parsed.dark === "boolean" ? parsed.dark : DEFAULT_PREFERENCES.dark,
      glass: typeof parsed.glass === "boolean" ? parsed.glass : DEFAULT_PREFERENCES.glass,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function writeThemePreferences(prefs: ThemePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore quota / private mode */
  }
}

/** Apply PF + Tailwind classes from preferences (idempotent). */
export function applyThemeToDocument(prefs: ThemePreferences): void {
  const root = document.documentElement;
  root.classList.add(PF_THEME_REDHAT_CLASS);
  if (prefs.dark) {
    root.classList.add("dark", PF_THEME_DARK_CLASS);
  } else {
    root.classList.remove("dark", PF_THEME_DARK_CLASS);
  }
  /**
   * Keep PatternFly `pf-v6-theme-glass` on the document so the brand canvas (diagonal light
   * treatment behind the shell) always matches the OpenShift 5+ glass console. Toggling the user
   * preference only adds `no-glass`, which flattens *our* `.app-glass-panel` surfaces in theme.css
   * — it must not strip PF glass, or the nav/main lose the background and look like a solid slab.
   */
  root.classList.add(PF_THEME_GLASS_CLASS);
  if (prefs.glass) {
    root.classList.remove("no-glass");
  } else {
    root.classList.add("no-glass");
  }
}

/** Call once at startup (before React) so the first paint uses stored or default Dark + Glass. */
export function applyStoredOrDefaultTheme(): void {
  applyThemeToDocument(readThemePreferences());
}

/** True when PatternFly glass theme is active (use for `Card isGlass`, etc.). */
export function isPatternFlyGlassActive(): boolean {
  const root = document.documentElement;
  return root.classList.contains(PF_THEME_GLASS_CLASS) && !root.classList.contains("no-glass");
}
