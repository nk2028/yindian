'use client';

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Query from "@/pages/Query";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import { getTranslation, type Language } from "@/lib/i18n";
import { useEffect } from "react";

function Navigation() {
  const [location] = useLocation();
  const { language, updateLanguage } = useApp();
  const t = getTranslation(language);

  const navItems = [
    { path: "/", label: t.nav.query },
    { path: "/settings", label: t.nav.settings },
    { path: "/about", label: t.nav.about },
  ];

  return (
    <nav className="bg-[#EB0000] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <img src="/yindian-icon.svg" alt="音典" className="w-8 h-8 invert" />
            <span className="text-xl font-bold tracking-tight [:lang(en)_&]:tracking-wide">{t.nav.title}</span>
          </div>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 text-sm font-bold transition-colors rounded-full ${
                  location === item.path
                    ? "bg-white text-[#EB0000]"
                    : "text-white hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  const { language, settings } = useApp();
  const t = getTranslation(language);
  
  // Update document title and lang attribute when language changes
  useEffect(() => {
    document.title = t.pageTitle;
    
    // Map language codes to HTML lang attribute values
    const langMap: Record<Language, string> = {
      'zh_HK': 'zh-HK',
      'zh_CN': 'zh-CN',
      'en_GB': 'en-GB',
      'ja': 'ja',
    };
    
    document.documentElement.lang = langMap[language];
  }, [language, t.pageTitle]);
  
  // Apply theme to html element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);
  
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Query} />
        <Route path="/settings" component={Settings} />
        <Route path="/about" component={About} />
        <Route>404 Not Found</Route>
      </Switch>
    </>
  );
}

function Home() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default Home;
