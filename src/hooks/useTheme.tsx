import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode =
  | "light-classic"
  | "light-warm"
  | "dark-premium"
  | "dark-oled"
  | "glass";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themes: { value: ThemeMode; label: string; icon: string }[];
}

const THEME_STORAGE_KEY = "attendance_theme";

const THEMES: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light-classic", label: "Light Classic", icon: "☀️" },
  { value: "light-warm", label: "Light Warm", icon: "🌤️" },
  { value: "dark-premium", label: "Dark Premium", icon: "🌙" },
  { value: "dark-oled", label: "Dark OLED", icon: "🕶️" },
  { value: "glass", label: "Glass / VisionOS", icon: "✨" },
];

function getInitialTheme(): ThemeMode {
  // Check localStorage first
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && THEMES.some((t) => t.value === stored)) {
      return stored as ThemeMode;
    }
  } catch {
    // ignore
  }

  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark-premium";
  }

  return "light-warm";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
    applyTheme(newTheme);
  };

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // Only auto-switch if user hasn't set a preference
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        const newTheme: ThemeMode = mq.matches ? "dark-premium" : "light-warm";
        setTheme(newTheme);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
