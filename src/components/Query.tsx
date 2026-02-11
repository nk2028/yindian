"use client";

import React, { useState, useMemo } from "react";

import { queryCharacters } from "@/lib/api";
import { buildTableRows, parse特殊語言字音 } from "@/lib/dataProcessor";
import { CharacterResultItem, ProcessedLanguage, TableRow, UserSettings } from "@/types";
import { useApp } from "@/contexts/AppContext";
import { getTranslation } from "@/lib/i18n";
import LanguageDetailModal from "@/components/LanguageDetailModal";
import { getTextColor } from "@/lib/utils";

const LoadingSpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const MagnifyingGlassIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const SpecialCharReadingFragments = ({
  parsedList,
}: {
  parsedList: { field: string; fieldValue: string; lang: string }[];
}) => {
  return (
    <>
      {parsedList.map((item, idx) => (
        <React.Fragment key={idx}>
          <span title={item.field} lang={item.lang}>
            {item.fieldValue}
          </span>
          {idx !== parsedList.length - 1 && "/"}
        </React.Fragment>
      ))}
    </>
  );
};

function renderTextWithStrong(text: string) {
  const parts = text.split("*");
  return <>{parts.map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part))}</>;
}

// TODO: This is a workaround. Fix this in the backend instead.
const removeSpaceBetweenTwoChineseChars = (text: string): string => {
  return text.replace(/(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, "");
};

const CharReadingBox = ({
  字音,
  langAbbr,
  idx,
  settings,
}: {
  字音: CharacterResultItem;
  langAbbr: string;
  idx: number;
  settings: UserSettings;
}) => {
  const isSpecialLanguage = langAbbr === "廣韻" || langAbbr === "中原音韻" || langAbbr === "東干甘肅話";
  const is八思巴字 = langAbbr === "蒙古字韻";
  const is女書 = langAbbr === "江永上江墟";

  if (typeof 字音 === "string") {
    return (
      <td
        key={idx}
        {...(isSpecialLanguage ? {} : { lang: "zh-Latn-fonipa" })}
        className="border border-border px-2 py-1 text-sm bg-card font-mono break-words overflow-hidden text-foreground"
        style={{ width: "192px", maxWidth: "192px", minWidth: "192px" }}>
        {isSpecialLanguage ? (
          <SpecialCharReadingFragments parsedList={parse特殊語言字音(字音, settings, langAbbr)} />
        ) : (
          字音
        )}
      </td>
    );
  }

  // 多音字
  else if (Array.isArray(字音)) {
    return (
      <td
        key={idx}
        className="border border-border px-2 py-1 text-sm bg-card font-mono break-words overflow-hidden text-foreground"
        style={{ width: "192px", maxWidth: "192px", minWidth: "192px" }}>
        {字音.map((item, idx) => {
          const 音標 = item[0];
          const 注釋 = item[1] ?? null;

          return (
            <div key={idx} className="mb-1 last:mb-0">
              {isSpecialLanguage ? (
                <SpecialCharReadingFragments parsedList={parse特殊語言字音(音標, settings, langAbbr)} />
              ) : (
                <span lang="zh-Latn-fonipa">{音標}</span>
              )}
              {注釋 && (
                <span
                  lang={is女書 ? "zh-Nshu" : is八思巴字 ? "zh-Phag" : "zh-HK"}
                  className="ml-1 text-xs text-muted-foreground">
                  {renderTextWithStrong(removeSpaceBetweenTwoChineseChars(注釋))}
                </span>
              )}
            </div>
          );
        })}
      </td>
    );
  }
};

const makeRow = (row: TableRow, settings: UserSettings) => {
  return row.字音列表.map((字音: CharacterResultItem, charIdx: number) => {
    return <CharReadingBox key={charIdx} 字音={字音} langAbbr={row.languageAbbr} idx={charIdx} settings={settings} />;
  });
};

const Query = () => {
  const {
    processedLanguages,
    settings,
    language,
    queryInput,
    setQueryInput,
    queryResults: contextQueryResults,
    setQueryResults: setContextQueryResults,
  } = useApp();
  const t = getTranslation(language);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasQueried, setHasQueried] = useState(!!contextQueryResults);
  const [selectedLanguage, setSelectedLanguage] = useState<ProcessedLanguage | null>(null);

  const handleQuery = async () => {
    if (!queryInput.trim()) return;

    setIsQuerying(true);
    setError(null);
    setHasQueried(true);

    try {
      const response = await queryCharacters(queryInput.trim());
      const results = response.data;
      setContextQueryResults(results);
    } catch (err) {
      // Show specific error message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.query.noResults);
      }
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleQuery();
    }
  };

  const tableRows = useMemo(() => {
    if (contextQueryResults === null) {
      return null;
    }
    return buildTableRows(contextQueryResults, processedLanguages, settings.selectedLanguages);
  }, [contextQueryResults, processedLanguages, settings.selectedLanguages]);

  return (
    <div className="bg-background">
      {/* Query Input Section */}
      <div className="bg-card p-3 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.query.placeholder}
              className="flex-1 border-2 border-border px-3 py-2 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
            />
            <button
              onClick={handleQuery}
              disabled={!queryInput.trim() || isQuerying}
              className="w-10 h-10 flex items-center justify-center bg-[#EB0000] text-white font-bold hover:bg-[#C50000] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors rounded-full flex-shrink-0"
              aria-label={t.query.button}>
              {isQuerying ? <LoadingSpinnerIcon /> : <MagnifyingGlassIcon />}
            </button>
          </div>
          {error && <div className="mt-2 text-[#EB0000] text-sm font-medium">{error}</div>}
        </div>
      </div>

      {/* Results Table Section */}
      {contextQueryResults !== null && tableRows !== null && tableRows.length > 0 && (
        <div className="p-4 flex justify-center">
          <div className="overflow-x-auto shadow-sm">
            <table className="border-collapse border border-border bg-card">
              <thead>
                <tr className="bg-[#EB0000] text-white">
                  <th
                    className="border border-border px-2 py-1 text-left text-sm font-bold bg-[#EB0000]"
                    style={{ width: "128px", maxWidth: "128px", minWidth: "128px" }}></th>
                  {(contextQueryResults[0].slice(1) as string[]).map((char: string, idx: number) => (
                    <th
                      key={idx}
                      className="border border-border px-2 py-1 text-center text-lg font-bold bg-[#EB0000]"
                      style={{ width: "192px", maxWidth: "192px", minWidth: "192px" }}>
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(row => {
                  return (
                    <tr key={row.languageId} className="hover:bg-secondary transition-colors">
                      <td
                        className="border border-border px-2 py-1 bg-card sticky left-0 z-20"
                        style={{ width: "128px", maxWidth: "128px", minWidth: "128px" }}>
                        <span
                          className="inline-block px-2 py-1 text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: row.color,
                            color: getTextColor(row.color),
                          }}
                          onClick={() => {
                            const lang = processedLanguages.find(l => l.id === row.languageId);
                            if (lang) {
                              setSelectedLanguage(lang);
                            }
                          }}
                          title="點擊查看詳情">
                          {row.languageAbbr}
                        </span>
                      </td>
                      {makeRow(row, settings)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-2 text-sm text-muted-foreground font-medium">共 {tableRows.length} 种语言</div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasQueried && (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#EB0000] mb-3 tracking-tight">{t.query.title}</h2>
            <p className="text-lg text-muted-foreground">{t.query.subtitle}</p>
          </div>
        </div>
      )}

      {/* Language Detail Modal */}
      <LanguageDetailModal language={selectedLanguage} onClose={() => setSelectedLanguage(null)} />
    </div>
  );
};

export default Query;
