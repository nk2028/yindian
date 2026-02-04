"use client";

import { useEffect } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Query from "@/components/Query";
import Settings from "@/components/Settings";
import About from "@/components/About";
import { getTranslation, type Language } from "@/lib/i18n";
import { Pages } from "@/types";

function Navigation() {
  const { page, setPage, language } = useApp();
  const t = getTranslation(language);

  const navItems: { key: Pages; label: string }[] = [
    { key: "query", label: t.nav.query },
    { key: "settings", label: t.nav.settings },
    { key: "about", label: t.nav.about },
  ];

  return (
    <nav className="bg-[#EB0000] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <img src="/yindian/icon.svg" alt="音典" className="w-8 h-8 invert" />
            <span className="text-xl font-bold tracking-tight [:lang(en)_&]:tracking-wide">{t.nav.title}</span>
          </div>
          <div className="flex gap-2">
            {navItems.map(item => (
              <input
                key={item.key}
                value={item.label}
                type="button"
                onClick={() => setPage(item.key)}
                className={`px-4 py-2 text-sm font-bold transition-colors rounded-full ${
                  page === item.key ? "bg-white text-[#EB0000]" : "text-white hover:bg-gray-200 hover:text-gray-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function PageSelector() {
  const { page, language, settings } = useApp();
  const t = getTranslation(language);

  // Update document title and lang attribute when language changes
  useEffect(() => {
    document.title = t.pageTitle;

    // Map language codes to HTML lang attribute values
    const langMap: Record<Language, string> = {
      zh_HK: "zh-HK",
      zh_CN: "zh-CN",
      ja: "ja",
      en_GB: "en-GB",
    };

    document.documentElement.lang = langMap[language];
  }, [language, t.pageTitle]);

  // Apply theme to html element
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  return (
    <>
      <Navigation />
      {page === "query" ? <Query /> : page === "settings" ? <Settings /> : page === "about" ? <About /> : null}
    </>
  );
}

function Home() {
  return (
    <AppProvider>
      <TooltipProvider>
        <PageSelector />
      </TooltipProvider>
    </AppProvider>
  );
}

export default Home;
