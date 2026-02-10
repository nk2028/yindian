# 音典網頁版

漢字音典是全面收集漢字讀音的資料庫。它源自 Maigo 製作的 [MCPDict](https://github.com/MaigoAkisame/MCPDict)，是最早的漢字讀音查詢工具之一。此後，由眾多專家聯手，不斷收集整理大量漢字讀音資料，製作了[漢字音典 APP](https://github.com/osfans/MCPDict)。nk2028 基於漢字音典 APP 發佈了音典網頁版，讓更多使用者能夠方便地查詢漢字在不同時代、不同地區的讀音。目前音典網頁版收錄了千餘種語言變體，涵蓋上古音、中古音、近代音及現代方言。

## 功能特點

- **千餘種語言變體**：收錄超過 2500 種語言變體，涵蓋上古音、中古音、近代音及現代方言
- **多音字支持**：完整顯示漢字的所有讀音，包括注釋說明，幫助區分不同用法
- **廣韻顯示方式定制**：支持自定義廣韻數據顯示顯示方式，包括切韻拼音、各家擬音、音系描述、反切等 24 個顯示方式
- **多語言界面**：支持繁體中文、簡體中文、英文、日文四種界面語言
- **主題切換**：支持淺色/深色主題切換
- **三種顯示模式**：地圖集二、音典、陳邡三種語言排序和分區方式

## 技術棧

- **前端框架**：React 19 + TypeScript
- **樣式**：Tailwind CSS
- **構建工具**：Next.js

## 開發

```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm dev

# 構建生產版本
pnpm build

# 預覽生產構建
pnpm start
```

## GitHub 仓庫

- **前端**：https://github.com/nk2028/yindian
- **后端**：https://github.com/nk2028/yindian-server

## 相關項目

- [漢字音典 APP 版](https://github.com/osfans/MCPDict) - 原版
- [唯二開發的網頁版](https://mcpdict.vear.vip/)（[前端](https://github.com/vearvip/mcpdict-frontend)、[后端](https://github.com/vearvip/mcpdict-backend)）：提供了字音查詢、長文註音、語言地圖、設置等功能
- [不羁開發的方音圖鑑](https://dialects.yzup.top)（[前端](https://github.com/jengzang/dialects-js-frontend)、[后端](https://github.com/jengzang/dialects-backend)）：提供了查中古、查音位、查調、查字、分區繪圖、自定義繪圖等功能

## 圖標製作

音典網頁版圖標由[綾香](https://github.com/ayaka14732)製作。

## 反饋問題

- 在 https://github.com/nk2028/yindian/issues 開 issue
- Telegram 群組：https://t.me/nk2028
- 發送電郵至：support@nk2028.shn.hk
- QQ 找綾香
