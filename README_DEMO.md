# 🎭 Basira 5.0 Demo Environment

This document explains how to set up and run the Basira Demo Environment.

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment**
   Ensure your `.env` file has the following set:

   ```env
   VITE_APP_MODE=demo
   VITE_SUPABASE_URL=YOUR_DEMO_PROJECT_URL
   VITE_SUPABASE_ANON_KEY=YOUR_DEMO_PROJECT_KEY
   ```

3. **Database Setup**
   Run the migration script in your Supabase Dashboard SQL Editor:
   - File: `supabase/migrations/03_demo_full_schema_and_data.sql`

4. **Run Application**

   ```bash
   npm run dev
   ```

## 🧪 Demo Features

- **Auto-Login**: Automatically logs in as an Admin in Demo Mode.
- **Rich Data**: Includes 50 beneficiaries, medical records, and social history.
- **Scenarios**:
  - **Medical Emergency**: Alert for beneficiary `RC-2024-047`.
  - **Behavioral Alert**: Alert for beneficiary `RC-2024-041`.

## 🛠 Project Structure

- `src/components/DemoBanner.tsx`: Top banner shown only in demo mode.
- `src/context/AuthContext.tsx`: Handles authentication bypass.
- `src/hooks/useCatering.ts`: Connects to real Catering tables.
- `src/modules/wisdom`: Institutional Memory module.

## ⚠️ Notes

- This is a **read-write** demo. Any changes made will persist until the database is reset.
- To reset data, simply re-run the `03_demo_full_schema_and_data.sql` script (it drops and recreates tables).
