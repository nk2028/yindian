"use client";

import { queryCharacters } from "@/lib/api";
import { buildTableRows, parse廣韻字音 } from "@/lib/dataProcessor";
import type { CharacterResult, ProcessedLanguage, TableRow } from "@/types";
import { useState, useEffect } from "react";
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
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
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

      // Build table rows
      const rows = buildTableRows(results, processedLanguages, settings.selectedLanguages);
      console.log("Table rows built:", rows.length);
      setTableRows(rows);
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

  // Rebuild table rows when contextQueryResults or settings change
  useEffect(() => {
    if (contextQueryResults && contextQueryResults.length > 0) {
      const rows = buildTableRows(contextQueryResults, processedLanguages, settings.selectedLanguages);
      setTableRows(rows);
    }
  }, [contextQueryResults, processedLanguages, settings.selectedLanguages]);

  // Extract characters from query results
  const characters = contextQueryResults ? contextQueryResults.map(([char]: CharacterResult) => char) : [];

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
      {tableRows.length > 0 && (
        <div className="p-4 flex justify-center">
          <div className="overflow-x-auto shadow-sm">
            <table className="border-collapse border border-border bg-card">
              <thead>
                <tr className="bg-[#EB0000] text-white">
                  <th
                    className="border border-border px-2 py-1 text-left text-sm font-bold bg-[#EB0000]"
                    style={{ width: "128px", maxWidth: "128px", minWidth: "128px" }}></th>
                  {characters.map((char: string, idx: number) => (
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
                      {characters.map((char: string, charIdx: number) => {
                        let 字音 = row.字音列表[char] || "—";
                        let isHTML = false;
                        // Special handling for Guangyun (廣韻) data
                        if (row.languageAbbr === "廣韻" && 字音 !== "—") {
                          字音 = parse廣韻字音(字音, settings.廣韻字段);
                          isHTML = true; // Guangyun data contains HTML tags
                        }

                        // Render with HTML or plain text
                        if (isHTML) {
                          return (
                            <td
                              key={`char-${charIdx}`}
                              className="border border-border px-2 py-1 text-sm bg-card font-mono break-words overflow-hidden text-foreground"
                              style={{ width: "192px", maxWidth: "192px", minWidth: "192px" }}
                              dangerouslySetInnerHTML={{ __html: 字音 }}
                            />
                          );
                        }

                        return (
                          <td
                            key={`char-${charIdx}`}
                            className="border border-border px-2 py-1 text-sm bg-card font-mono break-words overflow-hidden text-foreground"
                            style={{ width: "192px", maxWidth: "192px", minWidth: "192px" }}>
                            {字音}
                          </td>
                        );
                      })}
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
}

export default Query;
