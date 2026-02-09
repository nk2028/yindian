import type {
  CharacterResult,
  DisplayMode,
  DisplayModeConfig,
  廣韻字段,
  中原音韻字段,
  東干甘肅話字段,
  LanguageInfo,
  ProcessedLanguage,
  TableRow,
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
    sortOrder: lang[config.sortIndex] as number,
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
  queryResults: CharacterResult[],
  processedLanguages: ProcessedLanguage[],
  selectedLanguageIds: Set<number>,
): TableRow[] {
  // Create a map of language ID to language info for quick lookup
  const langMap = new Map<number, ProcessedLanguage>();
  processedLanguages.forEach(lang => {
    langMap.set(lang.id, lang);
  });

  // Create a map of language ID to 字音 for each character
  const lang字音映射 = new Map<number, { [char: string]: string }>();

  // Collect all 字音
  queryResults.forEach(([char, 字音數據列表]) => {
    字音數據列表.forEach(([langId, 字音, 註釋]) => {
      if (!lang字音映射.has(langId)) {
        lang字音映射.set(langId, {});
      }
      const lang字音 = lang字音映射.get(langId)!;

      const displayText = 註釋 ? `${字音} (${註釋})` : 字音;

      // If this language already has a 字音 for this character, append with separator
      if (lang字音[char]) {
        lang字音[char] += "; " + displayText;
      } else {
        lang字音[char] = displayText;
      }
    });
  });

  // Build rows only for languages that have data and are selected
  const rows: TableRow[] = [];
  lang字音映射.forEach((字音列表, langId) => {
    if (!selectedLanguageIds.has(langId)) return;

    const lang = langMap.get(langId);
    if (!lang) return;

    rows.push({
      languageId: langId,
      languageName: lang.name,
      languageAbbr: lang.abbreviation,
      color: lang.color,
      region: lang.region,
      sortOrder: lang.sortOrder,
      字音列表,
    });
  });

  // Sort by sort order
  rows.sort((a, b) => a.sortOrder - b.sortOrder);

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

/**
 * 廣韻字段類型標記（24個字段）
 * l: Romanization (羅馬化)
 * i: IPA (國際音標)
 * c: Cyrillic Romanization (西里爾羅馬化)
 * h: 漢字/文本
 * #: 其他
 */
const 廣韻字段類型 = "lllliiiiiiiiiiiiiih#hhhh";

/**
 * 中原音韻字段類型標記（5個字段）
 * i: IPA (國際音標)
 */
const 中原音韻字段類型 = "iiiii";

/**
 * 東干甘肅話字段類型標記（2個字段）
 * c: Cyrillic Romanization (西里爾羅馬化)
 * i: IPA (國際音標)
 */
const 東干甘肅話字段類型 = "ic";

/**
 * 包裝 IPA 音標
 */
function wrapIPA(字音: string): string {
  return `<span lang="zh-Latn-fonipa">${字音}</span>`;
}

/**
 * 包裝羅馬化
 */
function wrapRomanization(字音: string, script: string = "Latn"): string {
  return `<span lang="zh-${script}">${字音}</span>`;
}

/**
 * 解析廣韻字音數據並提取選中字段
 * @param 字音 原始字音字串，可能包含多個字音用 '; ' 分隔，每個字音的字段用 '/' 分隔
 * @param selectedFields 要提取的字段集合
 * @returns 格式化後的字串，只包含選中字段
 */
export function parse廣韻字音(字音: string, selectedFields: Set<廣韻字段>): string {
  // Handle multiple 字音 separated by '; '
  if (字音.includes("; ")) {
    const 字音列表 = 字音.split("; ");
    return 字音列表.map(p => parse廣韻字音(p, selectedFields)).join("; ");
  }

  // Split by '/' to get all fields
  const parts = 字音.split("/");

  // Handle short format (less than 24 fields) - just return as is
  // This happens when API returns simplified data like "rut" without full field breakdown
  if (parts.length < 廣韻字段列表.length) {
    return 字音;
  }

  // Extract selected fields from full 24-field format with type wrapping
  const selectedParts: string[] = [];
  廣韻字段列表.forEach((field, index) => {
    if (selectedFields.has(field) && parts[index]) {
      let fieldValue = parts[index];
      const fieldType = 廣韻字段類型[index];

      // Apply formatting based on field type
      switch (fieldType) {
        case "i":
          fieldValue = wrapIPA(fieldValue);
          break;
        case "l":
          fieldValue = wrapRomanization(fieldValue);
          break;
        case "c":
          fieldValue = wrapRomanization(fieldValue, "Cyrl");
          break;
        // 'h' and '#' types don't need special wrapping
      }

      selectedParts.push(fieldValue);
    }
  });

  // Join with ' / ' for better readability
  return selectedParts.length > 0 ? selectedParts.join("/") : 字音;
}

export function parse中原音韻字音(字音: string, selectedFields: Set<中原音韻字段>): string {
  // Handle multiple 字音 separated by '; '
  if (字音.includes("; ")) {
    const 字音列表 = 字音.split("; ");
    return 字音列表.map(p => parse中原音韻字音(p, selectedFields)).join("; ");
  }

  // Split by '/' to get all fields
  const parts = 字音.split("/");

  // Handle short format (less than 5 fields) - just return as is
  if (parts.length < 中原音韻字段列表.length) {
    return 字音;
  }

  // Extract selected fields from full 5-field format with type wrapping
  const selectedParts: string[] = [];
  中原音韻字段列表.forEach((field, index) => {
    if (selectedFields.has(field) && parts[index]) {
      let fieldValue = parts[index];
      const fieldType = 中原音韻字段類型[index];

      // Apply formatting based on field type
      if (fieldType === "i") {
        fieldValue = wrapIPA(fieldValue);
      }

      selectedParts.push(fieldValue);
    }
  });

  // Join with ' / ' for better readability
  return selectedParts.length > 0 ? selectedParts.join("/") : 字音;
}

export function parse東干甘肅話字音(字音: string, selectedFields: Set<東干甘肅話字段>): string {
  // Handle multiple 字音 separated by '; '
  if (字音.includes("; ")) {
    const 字音列表 = 字音.split("; ");
    return 字音列表.map(p => parse東干甘肅話字音(p, selectedFields)).join("; ");
  }

  // Split by '/' to get all fields
  const parts = 字音.split("/");

  // Handle short format (less than 2 fields) - just return as is
  if (parts.length < 東干甘肅話字段列表.length) {
    return 字音;
  }

  // Extract selected fields from full 2-field format with type wrapping
  const selectedParts: string[] = [];
  東干甘肅話字段列表.forEach((field, index) => {
    if (selectedFields.has(field) && parts[index]) {
      let fieldValue = parts[index];
      const fieldType = 東干甘肅話字段類型[index];

      // Apply formatting based on field type
      switch (fieldType) {
        case "i":
          fieldValue = wrapIPA(fieldValue);
          break;
        case "c":
          fieldValue = wrapRomanization(fieldValue, "Cyrl");
          break;
        // 'h' type doesn't need special wrapping
      }

      selectedParts.push(fieldValue);
    }
  });

  // Join with ' / ' for better readability
  return selectedParts.length > 0 ? selectedParts.join("/") : 字音;
}
