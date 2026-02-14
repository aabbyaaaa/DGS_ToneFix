# 工程師客服回覆禮貌化工具 (Dogger Polisher)

這是一個專為德記儀器 (Dogger Instruments) 工程師設計的內部工具。旨在將生硬的技術回覆自動轉換為符合商業禮儀的客戶服務訊息，同時嚴格保護技術術語、型號與數值不被竄改。

## 專案狀態
**MVP (Minimum Viable Product)**

## 核心功能
1.  **術語保護 (Term Integrity)**：透過 Prompt Engineering 嚴格限制 LLM 不可修改型號 (如 ABC-1234)、數值 (如 220V) 與單位。
2.  **多語氣輸出 (Multi-Tone)**：
    *   **精簡 (Concise)**：適合快速更新，標示色：Green (#9DC447)
    *   **標準 (Standard)**：適合一般客服，標示色：Turquoise (#26B7BC)
    *   **正式 (Formal)**：適合高階匯報，標示色：Purple (#8188BC)
3.  **品牌識別 (Brand Identity)**：整合 Dogger 企業識別色與 Logo。

## 技術堆疊
*   **Frontend**: React 19, Tailwind CSS
*   **AI Engine**: Google Gemini 3 Flash (via `@google/genai` SDK)
*   **Build**: ESM (No bundler required for dev)

## 使用說明
1.  輸入客戶姓氏與稱謂（選填）。
2.  貼上原始技術內容。
3.  點擊「開始轉換」。
4.  複製合適的語氣版本並發送。

## 開發者注意事項
*   API Key 必須透過環境變數 `API_KEY` 提供。
*   系統預設使用 `gemini-3-flash-preview` 模型以達到最佳速度與成本平衡。
