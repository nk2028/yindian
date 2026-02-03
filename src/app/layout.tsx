import type { Metadata } from "next";
import Script from "next/script";
import "./index.css";

export const metadata: Metadata = {
  title: "音典網頁版 - 漢字語音查詢工具",
  description: "漢字音典（Yindian）是全面收集漢字讀音的資料庫，支持千餘種語言變體的讀音對比查詢。",
  keywords: [
    "漢字讀音",
    "音典",
    "方言",
    "上古音",
    "中古音",
    "廣韻",
    "切韻",
    "漢語語音",
    "讀音查詢",
    "Yindian",
    "Chinese pronunciation",
    "dialect",
    "Guangyun",
  ],
  icons: {
    icon: "/yindian/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <head>
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token":"16ad6c356b37426cb31816318ed5a42d"}'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
