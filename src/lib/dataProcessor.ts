import type {
  CharacterResultTable,
  DisplayMode,
  DisplayModeConfig,
  LanguageInfo,
  ProcessedLanguage,
  TableRow,
  CharacterResultTableRow,
  CharacterResultItem,
  UserSettings,
} from "@/types";
import { 廣韻字段列表, 中原音韻字段列表, 東干甘肅話字段列表 } from "@/types";
import { Translations } from "./i18n";

/**
 * Display mode configurations
 */
export const DISPLAY_MODE_CONFIGS: Record<DisplayMode, DisplayModeConfig> = {
  地圖集二: {
    sortIndex: 3, // 地圖集二排序
    colorIndex: 4, // 地圖集二顏色
    regionIndex: 5, // 地圖集二分區
  },
  音典: {
    sortIndex: 6, // 音典排序
    colorIndex: 7, // 音典顏色
    regionIndex: 8, // 音典分區
  },
  陳邡: {
    sortIndex: 9, // 陳邡排序
    colorIndex: 10, // 陳邡顏色
    regionIndex: 11, // 陳邡分區
  },
};

/**
 * Process language data based on display mode
 */
export function processLanguages(languages: LanguageInfo[], displayMode: DisplayMode): ProcessedLanguage[] {
  const config = DISPLAY_MODE_CONFIGS[displayMode];

  return languages.map(lang => ({
    id: Number(lang[0]),
    name: String(lang[1]),
    abbreviation: String(lang[2]),
    sortOrder: lang[config.sortIndex] as string | null,
    color: lang[config.colorIndex] as string,
    region: lang[config.regionIndex] as string,
    location: lang[12],
    coordinates: lang[13] === null || lang[13].length === 0 ? null : lang[13],
  }));
}

/**
 * Build table rows from query results
 */
export function buildTableRows(
  queryResults: CharacterResultTable<string[]>,
  processedLanguages: ProcessedLanguage[],
  selectedLanguageIds: Set<number>,
): TableRow[] {
  // Create a map of language ID to language info for quick lookup
  const langMap = new Map<number, ProcessedLanguage>();
  processedLanguages.forEach(lang => {
    langMap.set(lang.id, lang);
  });

  const queryTableRows = queryResults.slice(1) as CharacterResultTableRow<string[]>[];

  const rows: TableRow[] = [];
  queryTableRows.forEach(row => {
    const langId = row[0];
    if (!selectedLanguageIds.has(langId)) return;

    const lang = langMap.get(langId);
    if (!lang) return;

    const { name: languageName, abbreviation: languageAbbr, color, region, sortOrder } = lang;
    const 字音列表 = row.slice(1) as CharacterResultItem[];
    rows.push({
      languageId: langId,
      languageName,
      languageAbbr,
      color,
      region,
      sortOrder: sortOrder ?? "龥", // Use "龥" as a placeholder for null sort order to ensure it sorts at the end
      字音列表,
    });
  });

  // Sort by sort order
  rows.sort((a, b) => a.sortOrder.localeCompare(b.sortOrder));

  return rows;
}

/**
 * Get display mode label in Chinese
 */
export function getDisplayModeLabel(mode: DisplayMode, t: Translations): string {
  switch (mode) {
    case "地圖集二":
      return t.settings.displayModeAtlas2;
    case "音典":
      return t.settings.displayModeYindian;
    case "陳邡":
      return t.settings.displayModeChenFang;
  }
}

// 類型標記
// l: Romanization (羅馬化)
// i: IPA (國際音標)
// c: Cyrillic Romanization (西里爾羅馬化)
// h: 漢字/文本
// #: 其他
const 廣韻字段類型 = "lllliiiiiiiiiiiiiih#hhhh" as const;
const 中原音韻字段類型 = "iiiii" as const;
const 東干甘肅話字段類型 = "ic" as const;

export function parse特殊語言字音(
  字音: string,
  settings: UserSettings,
  langAbbr: "廣韻" | "中原音韻" | "東干甘肅話",
): { field: string; fieldValue: string; lang: string }[] {
  const parts = 字音.split("/");

  let 字段列表: readonly string[];
  let 字段類型;
  let selectedFields: ReadonlySet<string>;
  switch (langAbbr) {
    case "廣韻":
      字段列表 = 廣韻字段列表;
      字段類型 = 廣韻字段類型;
      selectedFields = settings.廣韻字段;
      break;
    case "中原音韻":
      字段列表 = 中原音韻字段列表;
      字段類型 = 中原音韻字段類型;
      selectedFields = settings.中原音韻字段;
      break;
    case "東干甘肅話":
      字段列表 = 東干甘肅話字段列表;
      字段類型 = 東干甘肅話字段類型;
      selectedFields = settings.東干甘肅話字段;
      break;
  }

  // Extract selected fields from full 24-field format with type wrapping
  const selectedParts: { field: string; fieldValue: string; lang: string }[] = [];
  字段列表.forEach((field, index) => {
    if (selectedFields.has(field) && parts[index]) {
      const fieldValue = parts[index];
      const fieldType = 字段類型[index];

      // Apply formatting based on field type
      switch (fieldType) {
        case "i":
          selectedParts.push({ field, fieldValue, lang: "zh-Latn-fonipa" });
          break;
        case "l":
          selectedParts.push({ field, fieldValue, lang: "zh-Latn" });
          break;
        case "c":
          selectedParts.push({ field, fieldValue, lang: "zh-Cyrl" });
          break;
        case "h":
        case "#":
          selectedParts.push({ field, fieldValue, lang: "zh-HK" });
          break;
      }
    }
  });

  return selectedParts;
}
