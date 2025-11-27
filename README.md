# 寿司日次生産アプリ (PWA)

寿司売場の **日次生産管理** のために作られた、軽量でオフライン対応の PWA（Progressive Web App）です。  
iPhone / Android / PC で動作し、電波が無い状態でも利用できます。

各商品の本日パック数を入力するだけで、シャリ量（貫・kg）、巻物シャリ（g / kg）、売上金額を自動計算します。

---

## 主な機能

- 24種類以上の寿司・巻物・丼を入力可能
- 自動計算:
  - 1パック当たりシャリ(貫)
  - 合計シャリ(貫)
  - 合計シャリ(kg)
  - 巻物シャリ(g / kg)
  - 金額合計
- ダーク / ライトテーマ切替
- 本日のデータを `localStorage` に自動保存
- CSV エクスポートで日次記録を保存
- PWA 対応
  - ホーム画面に追加（iPhone/Android）
  - オフライン動作
  - 自動アップデート

---

## 使用技術

- HTML / CSS / Vanilla JavaScript
- PWA:
  - `manifest.json`
  - `service-worker.js`
- GitHub Pages でホスティング
- ローカル開発用に ASP.NET Minimal API

---

## フォルダ構成

\`\`\`text 
SushiProduction/
  Program.cs        # ローカル開発用
  docs/             # Web アプリ本体
    index.html
    service-worker.js
    manifest.json 
\`\`\`
---
English Version
---
# Sushi Daily Production App (PWA)

A lightweight, offline-capable **Progressive Web App** designed for managing daily sushi production.  
Runs on desktop and mobile (including iPhone), with full offline support using PWA service workers.

Enter the daily pack counts for each item, and the app automatically calculates shari amounts (kan/kg), makimono rice usage (g/kg), and total sales.

---

## Features

- 24+ sushi, maki, and donburi items supported
- Automatic calculation:
  - Shari per pack (kan)
  - Total shari (kan)
  - Total shari (kg)
  - Makimono rice (g / kg)
  - Total revenue (¥)
- Dark / Light theme toggle
- Auto-save of today's data using `localStorage`
- CSV export for daily records
- PWA features:
  - Add to Home Screen (iPhone/Android)
  - Offline operation
  - Auto-update via service worker

---

## Technology Stack

- HTML / CSS / Vanilla JavaScript
- PWA:
  - `manifest.json`
  - `service-worker.js`
- GitHub Pages hosting
- ASP.NET Minimal API for local development (optional)

---

## Folder Structure

```text
SushiProduction/
  Program.cs          # Local dev server
  docs/               # Main web application
    index.html
    service-worker.js
    manifest.json
