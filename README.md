# 音典網頁版 (Yindian Web)

漢字音典（Yindian）是全面收集漢字讀音的資料庫。它源自 Maigo 製作的 MCPDict，是最早的漢字讀音查詢工具之一。此後，由眾多專家聯手，不斷收集整理大量漢字讀音資料，製作了漢字音典 APP。nk2028 基於漢字音典 APP 發佈了音典網頁版，讓更多使用者能夠方便地查詢漢字在不同時代、不同地區的讀音。

## 功能特點

- **千餘種語言變體**: 收錄約 2400 種語言變體，涵蓋上古音、中古音、近代音及現代各地方言
- **多音字支持**: 完整顯示漢字的所有讀音，包括注釋說明，幫助區分不同用法
- **廣韻字段定制**: 支持自定義廣韻數據顯示字段，包括切韻拼音、各家擬音、音系描述、反切等 24 個字段
- **多語言界面**: 支持繁體中文、簡體中文、英文、日文四種界面語言
- **主題切換**: 支持淺色/深色主題切換
- **三種顯示模式**: 地圖集二、音典、陳邡三種語言排序和分區方式

## 技術棧

- **前端框架**: React 19 + TypeScript
- **樣式**: Tailwind CSS 4
- **UI 組件**: shadcn/ui
- **路由**: Wouter
- **構建工具**: Vite

## 項目結構

```
client/
  public/       # 靜態資源
  src/
    pages/      # 頁面組件
    components/ # 可復用 UI 組件
    contexts/   # React contexts (狀態管理)
    hooks/      # 自定義 React hooks
    lib/        # 工具函數和 API 調用
    types/      # TypeScript 類型定義
    App.tsx     # 路由和頂層布局
    main.tsx    # React 入口點
    index.css   # 全局樣式
```

## 開發

```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm dev

# 構建生產版本
pnpm build

# 預覽生產構建
pnpm preview
```

## GitHub Pages 部署

本項目已配置 GitHub Actions 自動部署。推送到 `main` 分支時將自動構建並部署到 GitHub Pages。

### 配置步驟

1. 在 GitHub 倉庫設置中啟用 GitHub Pages
   - 進入 Settings > Pages
   - Source 選擇 "GitHub Actions"

2. 如果部署到子路徑（如 `username.github.io/yindian-manus/`），需要設置環境變數：
   - 在 `.github/workflows/deploy.yml` 中的 Build 步驟添加：
   ```yaml
   - name: Build
     run: pnpm build
     env:
       NODE_ENV: production
       BASE_PATH: /yindian-manus/  # 修改為你的倉庫名稱
   ```

3. 如果部署到根域名（如 `yindian.example.com`），不需要設置 BASE_PATH，預設為 `/`

### 手動部署

```bash
# 構建（子路徑部署）
BASE_PATH=/yindian-manus/ pnpm build

# 構建（根域名部署）
pnpm build

# 構建輸出在 dist/public/ 目錄
```

## GitHub 仓庫

- **前端**: https://github.com/nk2028/yindian-manus
- **后端**: https://github.com/nk2028/yindian-server

## 相關項目

- [漢字音典 APP 版](https://github.com/osfans/MCPDict) - 原版
- [唯二開發的網頁版](https://mcpdict.vear.vip/)([前端](https://github.com/vearvip/mcpdict-frontend)、[后端](https://github.com/vearvip/mcpdict-backend)): 提供了字音查詢、長文註音、語言地圖、設置等功能
- [不羁開發的方音圖鑑](https://dialects.yzup.top)([前端](https://github.com/jengzang/dialects-js-frontend)、[后端](https://github.com/jengzang/dialects-backend)): 提供了查中古、查音位、查調、查字、分區繪圖、自定義繪圖等功能

## 圖標製作

音典網頁版圖標由[綾香](https://github.com/ayaka14732)製作。

## 製作工具

使用 [Manus AI](https://manus.im) 製作。

## 反饋問題

- 在 https://github.com/nk2028/yindian-manus/issues 開 issue
- Telegram 群組: https://t.me/nk2028
- 發送電郵至: support@nk2028.shn.hk
- QQ 找綾香

## 致謝

- Maigo: MCPDict 原作者
- 漢字音典 APP 開發團隊
- nk2028: 音典網頁版開發維護

## 許可證

本項目基於開源協議發布,具體許可證信息請參考 LICENSE 文件。
