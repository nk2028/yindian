import type { ApiResponse, CharacterResult, LanguageInfo } from "@/types";

const API_BASE = "https://1305783649-j61pduj0mx.ap-guangzhou.tencentscf.com";
const VERSION_CACHE_KEY = "yindian_api_version";
const LANGUAGES_CACHE_KEY = "yindian_languages_cache";

/**
 * Get cached API version
 */
const getCachedVersion = (): string | null => {
  try {
    return localStorage.getItem(VERSION_CACHE_KEY);
  } catch {
    return null;
  }
}

/**
 * Format Unix timestamp to human-readable string based on language locale
 */
export const getCachedVersionString = (language: string): string | null => {
  const timestamp = getCachedVersion();
  if (timestamp === null) return null;

  const date = new Date(Number(timestamp) * 1000); // Unix 时间戳是秒，需要转换为毫秒
  const locale = language.replace("_", "-");
  const dateTime = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  const timeZone =
    new Intl.DateTimeFormat(locale, { timeZoneName: "short" })
      .formatToParts(date)
      .find(part => part.type === "timeZoneName")?.value || "";
  return `${dateTime} ${timeZone}`;
};

/**
 * Set cached API version
 */
function setCachedVersion(version: string): void {
  try {
    localStorage.setItem(VERSION_CACHE_KEY, version);
  } catch (error) {
    console.error("Failed to cache version:", error);
  }
}

/**
 * Get cached languages data
 */
function getCachedLanguages(): LanguageInfo[] | null {
  try {
    const cached = localStorage.getItem(LANGUAGES_CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as LanguageInfo[];
  } catch {
    return null;
  }
}

/**
 * Set cached languages data
 */
function setCachedLanguages(languages: LanguageInfo[]): void {
  try {
    localStorage.setItem(LANGUAGES_CACHE_KEY, JSON.stringify(languages));
  } catch (error) {
    console.error("Failed to cache languages:", error);
  }
}

/**
 * Fetch all language information with version checking
 * Called once on page load and when version mismatch is detected
 */
export async function fetchLanguages(forceRefresh = false): Promise<LanguageInfo[]> {
  try {
    const response = await fetch(`${API_BASE}/list-langs/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = (await response.json()) as ApiResponse<LanguageInfo[]>;
    const { version, data } = apiResponse;

    // Check if we need to update cache
    const cachedVersion = getCachedVersion();
    const currentVersion = String(version); // Ensure version is string for comparison

    if (forceRefresh || !cachedVersion || cachedVersion !== currentVersion) {
      console.log(`Version mismatch or force refresh. Cached: ${cachedVersion}, API: ${currentVersion}`);
      setCachedVersion(currentVersion);
      setCachedLanguages(data);
      return data;
    }

    // Use cached data if version matches
    const cachedLanguages = getCachedLanguages();
    if (cachedLanguages) {
      console.log("Using cached languages data");
      return cachedLanguages;
    }

    // Fallback: cache and return API data
    setCachedVersion(currentVersion);
    setCachedLanguages(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch languages:", error);

    // Try to use cached data as fallback
    const cachedLanguages = getCachedLanguages();
    if (cachedLanguages) {
      console.warn("Using cached languages as fallback");
      return cachedLanguages;
    }

    throw error;
  }
}

/**
 * Query character pronunciations with version checking
 * @param chars - Chinese characters to query (no spaces)
 */
export async function queryCharacters(chars: string): Promise<{ version: string; data: CharacterResult[] }> {
  try {
    const url = `${API_BASE}/chars/?chars=${encodeURIComponent(chars)}`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = (await response.json()) as ApiResponse<CharacterResult[]>;

    // Check version and trigger language refresh if needed
    const cachedVersion = getCachedVersion();
    const currentVersion = String(apiResponse.version); // Ensure version is string for comparison
    if (cachedVersion && cachedVersion !== currentVersion) {
      console.log(`Version mismatch detected. Cached: ${cachedVersion}, API: ${currentVersion}`);
      // Trigger background refresh of languages
      fetchLanguages(true).catch(console.error);
    }

    return apiResponse;
  } catch (error) {
    console.error("Failed to query characters:", error);
    throw error;
  }
}
