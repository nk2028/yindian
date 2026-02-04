import zh_HK from "./i18n/zh_HK";
import zh_CN from "./i18n/zh_CN";
import ja from "./i18n/ja";
import en_GB from "./i18n/en_GB";

export type Language = "zh_HK" | "zh_CN" | "ja" | "en_GB";

export const LANGUAGE_DISPLAY_NAMES: Record<Language, string> = {
  zh_HK: "中文（繁體）",
  zh_CN: "中文（简体）",
  ja: "日本語",
  en_GB: "English",
};

export interface Translations {
  // Page title
  pageTitle: string;

  // Navigation
  nav: {
    title: string;
    query: string;
    settings: string;
    about: string;
  };

  // Query page
  query: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    buttonLoading: string;
    tableLanguage: string;
    noResults: string;
  };

  // Settings page
  settings: {
    title: string;
    interfaceLanguage: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    displayMode: string;
    displayModeAtlas2: string;
    displayModeYindian: string;
    displayModeChenFang: string;
    guangyunDisplay: string;
    languageSelection: string;
    selectAll: string;
    deselectAll: string;
    clearCache: string;
    clearCacheDesc: string;
    clearCacheButton: string;
    clearCacheConfirm: string;
  };

  // Language Detail Modal
  languageDetail: {
    region: string;
    location: string;
    coordinates: string;
    noMapData: string;
  };

  // About page
  about: {
    title: string;
    intro: string;
    history: string;
    features: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
    github: string;
    githubFrontend: string;
    githubBackend: string;
    relatedProjects: string;
    relatedApp: string;
    relatedWeiEr: string;
    relatedWeiErDesc: string;
    relatedBuJi: string;
    relatedBuJiDesc: string;
    iconCredit: string;
    manusCredit: string;
    feedback: string;
    feedbackGithub: string;
    feedbackTelegram: string;
    feedbackEmail: string;
    feedbackQQ: string;
  };
}

const translations: Record<Language, Translations> = {
  zh_HK,
  zh_CN,
  ja,
  en_GB,
};

export function getTranslation(language: Language): Translations {
  return translations[language] || translations["zh_HK"]; // Fallback to zh_HK if language not found
}

export function formatString(template: string, values: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}
