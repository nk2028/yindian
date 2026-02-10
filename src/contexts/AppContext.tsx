"use client";

import { processLanguages } from "@/lib/dataProcessor";
import type {
  DisplayMode,
  廣韻字段,
  中原音韻字段,
  東干甘肅話字段,
  Language,
  LanguageInfo,
  ProcessedLanguage,
  Theme,
  UserSettings,
  Pages,
  CharacterResultTable,
} from "@/types";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchLanguages } from "@/lib/api";

interface AppContextValue {
  // Language data
  rawLanguages: LanguageInfo[];
  processedLanguages: ProcessedLanguage[];
  isLoadingLanguages: boolean;
  languagesError: Error | null;

  // User settings
  settings: UserSettings;
  updateDisplayMode: (mode: DisplayMode) => void;
  toggleLanguage: (langId: number) => void;
  selectAllLanguages: () => void;
  deselectAllLanguages: () => void;
  toggle廣韻字段: (field: 廣韻字段) => void;
  toggle中原音韻字段: (field: 中原音韻字段) => void;
  toggle東干甘肅話字段: (field: 東干甘肅話字段) => void;
  updateTheme: (theme: Theme) => void;

  // Current page
  page: Pages;
  setPage: (page: Pages) => void;

  // UI language
  language: Language;
  setDisplayLanguage: (lang: Language) => void;

  // Query state
  queryInput: string;
  setQueryInput: (input: string) => void;
  queryResults: CharacterResultTable<string[]> | null;
  setQueryResults: (results: CharacterResultTable<string[]> | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const detectSystemTheme = (): Theme => {
  try {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  } catch {
    return "light";
  }
};

// https://github.com/osfans/MCPDict/blob/aee3606025410afc1be5c6f5bf1bd95ae8f237bf/app/src/main/res/values/strings.xml#L204-L206
const DEFAULT_中原音韻字段: 中原音韻字段[] = ["unt"];
// https://github.com/osfans/MCPDict/blob/aee3606025410afc1be5c6f5bf1bd95ae8f237bf/app/src/main/res/values/strings.xml#L218-L221
const DEFAULT_東干甘肅話字段: 東干甘肅話字段[] = ["音標", "西里爾字母"];

const DEFAULT_SETTINGS: UserSettings = {
  displayMode: "地圖集二",
  selectedLanguages: new Set<number>(),
  廣韻字段: new Set<廣韻字段>(["切韻拼音", "切韻音系描述", "unt(2022)擬音"]), // Default fields
  中原音韻字段: new Set<中原音韻字段>(DEFAULT_中原音韻字段),
  東干甘肅話字段: new Set<東干甘肅話字段>(DEFAULT_東干甘肅話字段),
  theme: detectSystemTheme(), // Default theme based on system preference
};

const DEFAULT_LANGUAGE: Language = "zh_HK";

const DISPLAY_LANGUAGE_KEY = "yindian-language";

export const getCachedDisplayLanguage = (): Language | null => {
  try {
    const cached = localStorage.getItem(DISPLAY_LANGUAGE_KEY);
    if (!cached) return null;
    return cached as Language;
  } catch {
    return null;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [rawLanguages, setRawLanguages] = useState<LanguageInfo[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [languagesError, setLanguagesError] = useState<Error | null>(null);
  const [queryInput, setQueryInput] = useState<string>("");
  const [queryResults, setQueryResults] = useState<CharacterResultTable<string[]> | null>(null);
  const [page, setPage] = useState<Pages>("query");
  const [language, setLanguageState] = useState<Language>(getCachedDisplayLanguage() || DEFAULT_LANGUAGE);
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Try to load settings from localStorage
    try {
      const saved = localStorage.getItem("yindian-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          displayMode: parsed.displayMode as DisplayMode,
          selectedLanguages: new Set(parsed.selectedLanguages || []),
          廣韻字段: new Set<廣韻字段>(parsed.廣韻字段 || ["切韻拼音", "切韻音系描述", "unt(2022)擬音"]),
          中原音韻字段: new Set<中原音韻字段>(parsed.中原音韻字段 || DEFAULT_中原音韻字段),
          東干甘肅話字段: new Set<東干甘肅話字段>(parsed.東干甘肅話字段 || DEFAULT_東干甘肅話字段),
          theme: parsed.theme || detectSystemTheme(),
        };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "yindian-settings",
        JSON.stringify({
          displayMode: settings.displayMode,
          selectedLanguages: Array.from(settings.selectedLanguages),
          廣韻字段: Array.from(settings.廣韻字段),
          中原音韻字段: Array.from(settings.中原音韻字段),
          東干甘肅話字段: Array.from(settings.東干甘肅話字段),
          theme: settings.theme,
        }),
      );
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }, [settings]);

  // Load languages on mount
  useEffect(() => {
    let mounted = true;

    fetchLanguages()
      .then(data => {
        if (!mounted) return;
        setRawLanguages(data);
        // Select all languages by default
        const allIds = new Set(data.map(lang => Number(lang[0])));
        setSettings(prev => ({
          ...prev,
          selectedLanguages: allIds,
        }));
        setIsLoadingLanguages(false);
      })
      .catch(error => {
        if (!mounted) return;
        setLanguagesError(error);
        setIsLoadingLanguages(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Process languages based on current display mode
  const processedLanguages = processLanguages(rawLanguages, settings.displayMode);

  const updateDisplayMode = (mode: DisplayMode) => {
    setSettings(prev => ({ ...prev, displayMode: mode }));
  };

  const toggleLanguage = (langId: number) => {
    setSettings(prev => {
      const newSelected = new Set(prev.selectedLanguages);
      if (newSelected.has(langId)) {
        newSelected.delete(langId);
      } else {
        newSelected.add(langId);
      }
      return { ...prev, selectedLanguages: newSelected };
    });
  };

  const selectAllLanguages = () => {
    const allIds = new Set(rawLanguages.map(lang => Number(lang[0])));
    setSettings(prev => ({ ...prev, selectedLanguages: allIds }));
  };

  const deselectAllLanguages = () => {
    setSettings(prev => ({ ...prev, selectedLanguages: new Set() }));
  };

  const toggle廣韻字段 = (field: 廣韻字段) => {
    setSettings(prev => {
      const newFields = new Set(prev.廣韻字段);
      if (newFields.has(field)) {
        newFields.delete(field);
      } else {
        newFields.add(field);
      }
      return { ...prev, 廣韻字段: newFields };
    });
  };

  const toggle中原音韻字段 = (field: 中原音韻字段) => {
    setSettings(prev => {
      const newFields = new Set(prev.中原音韻字段);
      if (newFields.has(field)) {
        newFields.delete(field);
      } else {
        newFields.add(field);
      }
      return { ...prev, 中原音韻字段: newFields };
    });
  };

  const toggle東干甘肅話字段 = (field: 東干甘肅話字段) => {
    setSettings(prev => {
      const newFields = new Set(prev.東干甘肅話字段);
      if (newFields.has(field)) {
        newFields.delete(field);
      } else {
        newFields.add(field);
      }
      return { ...prev, 東干甘肅話字段: newFields };
    });
  };

  const updateTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const setDisplayLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(DISPLAY_LANGUAGE_KEY, lang);
    } catch (e) {
      console.error("Failed to save language:", e);
    }
  };

  const value: AppContextValue = {
    rawLanguages,
    processedLanguages,
    isLoadingLanguages,
    languagesError,
    settings,
    updateDisplayMode,
    page,
    setPage,
    toggleLanguage,
    selectAllLanguages,
    deselectAllLanguages,
    toggle廣韻字段,
    toggle中原音韻字段,
    toggle東干甘肅話字段,
    updateTheme,
    language,
    setDisplayLanguage,
    queryInput,
    setQueryInput,
    queryResults,
    setQueryResults,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
