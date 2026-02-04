/**
 * API response wrapper with version
 */
export interface ApiResponse<T> {
  version: string;
  data: T;
}

/**
 * Language information from /list-langs/ API
 * Array format: [語言ID, 語言, 簡稱, 地圖集二排序, 地圖集二顏色, 地圖集二分區, 音典排序, 音典顏色, 音典分區, 陳邡排序, 陳邡顏色, 陳邡分區, 地點, 經緯度]
 */
export type LanguageInfo = [
  number, // 0: 語言ID
  string, // 1: 語言 (full name)
  string, // 2: 簡稱 (abbreviation)
  string, // 3: 地圖集二排序
  string, // 4: 地圖集二顏色
  string, // 5: 地圖集二分區
  string, // 6: 音典排序
  string, // 7: 音典顏色
  string, // 8: 音典分區
  string, // 9: 陳邡排序
  string, // 10: 陳邡顏色
  string, // 11: 陳邡分區
  string, // 12: 地點 (location)
  string | null, // 13: 經緯度 (coordinates)
];

/**
 * Character pronunciation data
 * Format: [langId, 字音, 註釋?]
 * - langId: Language ID
 * - 字音: Pronunciation string
 * - 註釋: Optional 註釋, useful for distinguishing multiple 字音
 */
export type 字音數據 = [number, string, string?];

/**
 * Character query result
 * Format: [character, [[langId, 字音, 註釋?], ...]]
 */
export type CharacterResult = [string, 字音數據[]];

/**
 * Display mode for sorting and coloring
 */
export const displayModes = ["地圖集二", "音典", "陳邡"] as const;

export type DisplayMode = typeof displayModes[number];

/**
 * Display mode configuration
 */
export interface DisplayModeConfig {
  sortIndex: number; // Index in LanguageInfo array for sorting
  colorIndex: number; // Index in LanguageInfo array for color
  regionIndex: number; // Index in LanguageInfo array for region
}

// pages
/**
 * Application pages
 */
export const pages = ["query", "settings", "about"] as const;

export type Pages = typeof pages[number];

/**
 * Language code for UI
 */
export type Language = "zh_HK" | "zh_CN" | "ja" | "en_GB";

/**
 * Theme mode
 */
export type Theme = "light" | "dark";

/**
 * 所有廣韻字段（按順序）
 */
export const 廣韻字段列表 = [
  "切韻拼音",
  "白一平轉寫",
  "古韻羅馬字",
  "有女羅馬字",
  "髙本漢擬音",
  "王力(1957)擬音",
  "王力(1985)擬音",
  "李榮擬音",
  "邵榮芬擬音",
  "蒲立本擬音",
  "鄭張尙芳擬音",
  "潘悟雲(2000)擬音",
  "潘悟雲(2013)擬音",
  "潘悟雲(2023)擬音",
  "unt(2020)擬音",
  "unt(2022)擬音",
  "unt通俗擬音",
  "msoeg擬音",
  "切韻音系描述",
  "攝",
  "方音字彙描述",
  "廣韻韻目原貌",
  "折合平水韻目原貌",
  "反切",
] as const;

/**
 * 廣韻字段名稱
 */
export type 廣韻字段 = typeof 廣韻字段列表[number];

/**
 * User settings
 */
export interface UserSettings {
  displayMode: DisplayMode;
  selectedLanguages: Set<number>; // Set of language IDs
  廣韻字段: Set<廣韻字段>; // 選中要顯示的廣韻字段
  theme: Theme; // UI theme (light/dark)
}

/**
 * Processed language data for display
 */
export interface ProcessedLanguage {
  id: number;
  name: string;
  abbreviation: string;
  sortOrder: number;
  color: string;
  region: string;
  location: string;
  coordinates: string | null;
}

/**
 * Table row data for character comparison
 */
export interface TableRow {
  languageId: number;
  languageName: string;
  languageAbbr: string;
  color: string;
  region: string;
  sortOrder: number;
  字音列表: { [char: string]: string }; // char -> 字音
}
