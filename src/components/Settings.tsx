"use client";

import { useApp } from "@/contexts/AppContext";
import { getDisplayModeLabel } from "@/lib/dataProcessor";
import { displayModes, 廣韻字段列表, 中原音韻字段列表, 東干甘肅話字段列表, ProcessedLanguage } from "@/types";
import React, { useState, useMemo } from "react";
import { getTranslation } from "@/lib/i18n";
import { getTextColor } from "@/lib/utils";
import { getCachedVersionString } from "@/lib/api";

interface TreeNode {
  label: string;
  path: string;
  color: string;
  languages: ProcessedLanguage[];
  children: TreeNode[];
  totalCount: number;
}

export default function Settings() {
  const {
    processedLanguages,
    settings,
    updateDisplayMode,
    toggleLanguage,
    selectAllLanguages,
    deselectAllLanguages,
    toggle廣韻字段,
    toggle中原音韻字段,
    toggle東干甘肅話字段,
    updateTheme,
    language,
    setDisplayLanguage,
  } = useApp();
  const t = getTranslation(language);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  // Filter languages by search term
  const filteredLanguages = useMemo(() => {
    if (!searchTerm.trim()) return processedLanguages;
    const term = searchTerm.toLowerCase();
    return processedLanguages.filter(
      lang => lang.name.toLowerCase().includes(term) || lang.abbreviation.toLowerCase().includes(term),
    );
  }, [processedLanguages, searchTerm]);

  // Group languages by region for visual organization
  const languagesByRegion = useMemo(() => {
    const groups = new Map<string, typeof processedLanguages>();
    filteredLanguages.forEach(lang => {
      const region = lang.region;
      if (!groups.has(region)) {
        groups.set(region, []);
      }
      groups.get(region)!.push(lang);
    });

    // TODO: simplify this sorting logic
    return Array.from(groups.entries()).sort(([, a], [, b]) => {
      // Use "龥" as a placeholder for null sort order to ensure it sorts at the end
      const minSortOrderA = a.map(lang => lang.sortOrder).sort((x, y) => (x ?? "龥").localeCompare(y ?? "龥"))[0];
      const minSortOrderB = b.map(lang => lang.sortOrder).sort((x, y) => (x ?? "龥").localeCompare(y ?? "龥"))[0];
      return (minSortOrderA ?? "龥").localeCompare(minSortOrderB ?? "龥");
    });
  }, [filteredLanguages]);

  const languageTree = useMemo((): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    for (const [region, langs] of languagesByRegion) {
      if (!region) continue;
      const parts = region.split("－");

      for (let depth = 0; depth < parts.length; depth++) {
        const path = parts.slice(0, depth + 1).join("－");

        if (!nodeMap.has(path)) {
          const node: TreeNode = {
            label: parts[depth],
            path,
            color: langs[0]?.color || "#EB0000",
            languages: [],
            children: [],
            totalCount: 0,
          };
          nodeMap.set(path, node);

          if (depth === 0) {
            roots.push(node);
          } else {
            const parentPath = parts.slice(0, depth).join("－");
            nodeMap.get(parentPath)!.children.push(node);
          }
        }

        if (depth === parts.length - 1) {
          nodeMap.get(path)!.languages = langs;
        }
      }
    }

    function calcTotalCount(node: TreeNode): number {
      const childTotal = node.children.reduce((sum, c) => sum + calcTotalCount(c), 0);
      node.totalCount = node.languages.length + childTotal;
      return node.totalCount;
    }
    roots.forEach(calcTotalCount);

    return roots;
  }, [languagesByRegion]);

  const isSearching = searchTerm.trim().length > 0;

  const toggleExpanded = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const expanded = isSearching || expandedPaths.has(node.path);
    const hasColor = node.color && node.color.replace("#", "").length === 6;
    const textColor = hasColor ? getTextColor(node.color) : undefined;

    return (
      <div key={node.path} className="border-b border-border last:border-b-0">
        <button
          className="w-full text-left text-xs font-bold py-1 flex items-center gap-1 hover:brightness-90 transition-all"
          style={{ backgroundColor: hasColor ? node.color : undefined, color: textColor, paddingLeft: `${8 + depth * 12}px`, paddingRight: "8px" }}
          onClick={() => toggleExpanded(node.path)}>
          <span className="flex-shrink-0 w-3">{expanded ? "▼" : "▶"}</span>
          <span>
            {node.label} ({node.totalCount})
          </span>
        </button>

        {expanded && (
          <>
            {node.children.map(child => renderTreeNode(child, depth + 1))}
            {node.languages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
                {node.languages.map(lang => (
                  <label
                    key={lang.id}
                    className="flex items-start gap-1 p-1 hover:bg-secondary cursor-pointer border-r border-b border text-xs leading-tight">
                    <input
                      type="checkbox"
                      checked={settings.selectedLanguages.has(lang.id)}
                      onChange={() => toggleLanguage(lang.id)}
                      className="w-3 h-3 mt-0.5 flex-shrink-0 accent-primary"
                    />
                    <span className="min-w-0 break-words text-foreground">{lang.name}</span>
                  </label>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const selectedCount = settings.selectedLanguages.size;
  const totalCount = processedLanguages.length;

  const displayLanguageList = [
    { code: "zh_HK", label: "繁體中文" },
    { code: "zh_CN", label: "简体中文" },
    { code: "ja", label: "日本語" },
    { code: "en_GB", label: "English" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-[#EB0000] pb-3 border-b-2 border-[#EB0000]">{t.settings.title}</h1>

        {/* Show Version and Clear Cache Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t.settings.dataVersion}</h2>
              <p className="text-sm text-muted-foreground mt-2">{getCachedVersionString(language) ?? "N/A"}</p>
            </div>
            <button
              onClick={() => {
                if (confirm(t.settings.clearCacheConfirm)) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-sm font-medium bg-[#EB0000] text-white hover:bg-[#C50000] transition-colors rounded-full">
              {t.settings.clearCacheButton}
            </button>
          </div>
        </section>

        {/* Interface Language Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-3 text-foreground">{t.settings.interfaceLanguage}</h2>
          <div className="flex gap-2 flex-wrap">
            {displayLanguageList.map(lang => (
              <button
                key={lang.code}
                onClick={() => setDisplayLanguage(lang.code)}
                className={`px-6 py-1.5 text-sm font-medium transition-colors rounded-full ${
                  language === lang.code ? "bg-[#EB0000] text-white" : "bg-card text-card-foreground hover:bg-secondary"
                }`}>
                {lang.label}
              </button>
            ))}
          </div>
        </section>

        {/* Theme Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-3 text-foreground">{t.settings.theme}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => updateTheme("light")}
              className={`px-6 py-1.5 text-sm font-medium transition-colors rounded-full ${
                settings.theme === "light"
                  ? "bg-[#EB0000] text-white"
                  : "bg-card text-card-foreground hover:bg-secondary"
              }`}>
              {t.settings.themeLight}
            </button>
            <button
              onClick={() => updateTheme("dark")}
              className={`px-6 py-1.5 text-sm font-medium transition-colors rounded-full ${
                settings.theme === "dark"
                  ? "bg-[#EB0000] text-white"
                  : "bg-card text-card-foreground hover:bg-secondary"
              }`}>
              {t.settings.themeDark}
            </button>
          </div>
        </section>

        {/* Display Mode Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-3 text-foreground">{t.settings.displayMode}</h2>
          <div className="flex gap-2">
            {displayModes.map(mode => (
              <button
                key={mode}
                onClick={() => updateDisplayMode(mode)}
                className={`px-6 py-1.5 text-sm font-medium transition-colors rounded-full ${
                  settings.displayMode === mode
                    ? "bg-[#EB0000] text-white"
                    : "bg-card text-card-foreground hover:bg-secondary"
                }`}>
                {getDisplayModeLabel(mode, t)}
              </button>
            ))}
          </div>
        </section>

        {/* Guangyun Display Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t.settings.guangyunDisplay}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  廣韻字段列表.forEach(field => {
                    if (!settings.廣韻字段.has(field)) {
                      toggle廣韻字段(field);
                    }
                  });
                }}
                className="px-4 py-1.5 text-sm font-medium bg-[#EB0000] text-white hover:bg-[#C50000] transition-colors rounded-full">
                {t.settings.selectAll}
              </button>
              <button
                onClick={() => {
                  廣韻字段列表.forEach(field => {
                    if (settings.廣韻字段.has(field)) {
                      toggle廣韻字段(field);
                    }
                  });
                }}
                className="px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors rounded-full">
                {t.settings.deselectAll}
              </button>
            </div>
          </div>

          {/* Guangyun Fields Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
            {廣韻字段列表.map(field => (
              <label
                key={field}
                className="flex items-start gap-1 p-1 hover:bg-secondary cursor-pointer border-r border-b border text-xs leading-tight">
                <input
                  type="checkbox"
                  checked={settings.廣韻字段.has(field)}
                  onChange={() => toggle廣韻字段(field)}
                  className="w-3 h-3 mt-0.5 flex-shrink-0 accent-primary"
                />
                <span className="min-w-0 break-words text-foreground">{field}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Zhongyuan Yinyun Display Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t.settings.zhongyuanDisplay}</h2>
            </div>
          </div>

          {/* Zhongyuan Yinyun Fields Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
            {中原音韻字段列表.map(field => (
              <label
                key={field}
                className="flex items-start gap-1 p-1 hover:bg-secondary cursor-pointer border-r border-b border text-xs leading-tight">
                <input
                  type="checkbox"
                  checked={settings.中原音韻字段.has(field)}
                  onChange={() => toggle中原音韻字段(field)}
                  className="w-3 h-3 mt-0.5 flex-shrink-0 accent-primary"
                />
                <span className="min-w-0 break-words text-foreground">{field}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Donggan Gansu Dialect Display Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t.settings.dunganGansuDisplay}</h2>
            </div>
          </div>

          {/* Donggan Gansu Dialect Fields Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
            {東干甘肅話字段列表.map(field => (
              <label
                key={field}
                className="flex items-start gap-1 p-1 hover:bg-secondary cursor-pointer border-r border-b border text-xs leading-tight">
                <input
                  type="checkbox"
                  checked={settings.東干甘肅話字段.has(field)}
                  onChange={() => toggle東干甘肅話字段(field)}
                  className="w-3 h-3 mt-0.5 flex-shrink-0 accent-primary"
                />
                <span className="min-w-0 break-words text-foreground">{field}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Language Selection Section */}
        <section className="mb-4 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">
              {t.settings.languageSelection} ({selectedCount}/{totalCount})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={selectAllLanguages}
                className="px-4 py-1.5 text-sm font-medium bg-[#EB0000] text-white hover:bg-[#C50000] transition-colors rounded-full">
                {t.settings.selectAll}
              </button>
              <button
                onClick={deselectAllLanguages}
                className="px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors rounded-full">
                {t.settings.deselectAll}
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索语言..."
              className="w-full border-2 border-border px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full bg-background text-foreground"
            />
          </div>

          {/* Hierarchical language tree grouped by region */}
          <div className="border border-border">
            {languageTree.map(node => renderTreeNode(node))}
          </div>
        </section>
      </div>
    </div>
  );
}
