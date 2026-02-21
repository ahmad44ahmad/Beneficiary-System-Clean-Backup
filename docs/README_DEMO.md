# 🎭 Basira Demo Environment

> "Clean as a car from the port."

This is the **Basira Demo Version** designed for presentations and scenarios. It is pre-loaded with rich, realistic mock data and scenarios.

## 🚀 Quick Start

1. **Run the App**:

    ```bash
    npm run dev
    ```

2. **Access**:
    - **URL**: `http://localhost:5173`
    - **Login**: (Auto-bypassed in Demo Mode)

## 🌟 Key Features

### 1. 📚 Digital Library (Google Drive)

- A "Stupid Simple" integration to view your Google Drive files directly.
- **Setup**:
    1. Share your Drive file/folder as "Anyone with the link".
    2. Add the link to `.env`: `VITE_KNOWLEDGE_BASE_URL=...`
    3. View it in the "المكتبة الرقمية" tab.

### 2. 👥 Rich Beneficiary Data

- **50 Beneficiaries**: Pre-loaded with diverse cases (Intellectual, Physical, Multiple).
- **Scenarios**: Look for tags like `⚠️ سيناريو` or `⭐ سيناريو` for interactive demos.

### 3. 🔄 One-Click Reset

- To reset the demo to its original state (e.g., after a presentation):

    ```bash
    # (Optional) Future script can go here
    ```

## 🛠 Troubleshooting

- **Supabase Connection**: Checked via `.env`.
- **Missing Data?**: Ensure the migration `03_demo_full_schema_and_data.sql` was applied.

---
*Basira System - Ministry of Human Resources and Social Development*
