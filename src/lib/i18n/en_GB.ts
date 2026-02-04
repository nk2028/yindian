import type { Translations } from "../i18n";

const en_GB: Translations = {
  pageTitle: "Yindian Web – Chinese Character Pronunciation Lookup Tool",
  nav: {
    title: "Yindian",
    query: "Lookup",
    settings: "Settings",
    about: "About",
  },
  query: {
    title: "Yindian Web",
    subtitle: "Enter Chinese characters to begin",
    placeholder: "Enter Chinese characters to look up pronunciations",
    button: "Search",
    buttonLoading: "Searching...",
    tableLanguage: "Language",
    noResults: "No results found",
  },
  settings: {
    title: "Settings",
    interfaceLanguage: "Interface Language",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    displayMode: "Display Mode",
    displayModeAtlas2: "Atlas II",
    displayModeYindian: "Yindian",
    displayModeChenFang: "Chen Fang",
    guangyunDisplay: "Guangyun Display",
    languageSelection: "Language Selection",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    clearCache: "Clear Cache",
    clearCacheDesc: "Clear all locally stored settings and cached data",
    clearCacheButton: "Clear Cache",
    clearCacheConfirm: "Are you sure you want to clear all cache? This action will reset all settings.",
  },
  languageDetail: {
    region: "Classification:",
    location: "Location:",
    coordinates: "Coordinates:",
    noMapData: "No map data available",
  },
  about: {
    title: "About Yindian Web",
    intro:
      "Yindian (Chinese Character Pronunciation Dictionary) is a comprehensive database of Chinese character pronunciations. It originated from MCPDict created by Maigo and is one of the earliest tools for querying Chinese character readings.",
    history:
      "Subsequently, numerous experts collaborated to continuously collect and organise a vast amount of pronunciation data, resulting in the Yindian mobile app. Based on the Yindian app, nk2028 released Yindian Web, enabling more users to conveniently query character pronunciations across different historical periods and geographical regions. At present, Yindian Web includes over a thousand language varieties, covering Old Chinese, Middle Chinese, Early Modern Chinese, and modern dialects.",
    features: "Key Features",
    feature1:
      "Supports simultaneous lookup of multiple characters, with tabular comparison of pronunciations across different language varieties",
    feature2: "Provides three display modes (Atlas II / Yindian / 陳邡) to accommodate different lookup preferences",
    feature3:
      "A flexible language filtering system with colour tags and hierarchical classification for fast localisation of target languages",
    feature4:
      "Detailed display options for historical phonological sources such as Guangyun, supporting comparison across multiple reconstruction systems",
    github: "GitHub Links",
    githubFrontend: "Frontend: ",
    githubBackend: "Backend: ",
    relatedProjects: "Related Projects",
    relatedApp: "Yindian Mobile App (original)",
    relatedWeiEr: "Web version by 唯二",
    relatedWeiErDesc: "Provides character pronunciation lookup, long-text annotation, language maps, settings and more",
    relatedBuJi: "Dialect Atlas by 不羈",
    relatedBuJiDesc:
      "Provides Middle Chinese lookup, phoneme lookup, tone lookup, character lookup, regional mapping, custom mapping features, and more",
    iconCredit: "Yindian Web icon created by Ayaka",
    manusCredit: "Built with Manus AI",
    feedback: "Feedback",
    feedbackGithub: "GitHub Issues",
    feedbackTelegram: "Telegram Group：",
    feedbackEmail: "Email: ",
    feedbackQQ: "Contact Ayaka on QQ",
  },
};

export default en_GB;
