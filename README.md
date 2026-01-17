<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# نظام بصيرة - Basira Quality Management System

> مركز التأهيل الشامل بمنطقة الباحة | Al-Baha Comprehensive Rehabilitation Center

Arabic RTL healthcare quality management system built with React 19, TypeScript, Framer Motion, and Tailwind CSS. Compliant with Ministry of Human Resources and Social Development (HRSD) branding.

---

## ✅ Feature Checklist

### Beneficiaries Management

- [x] **Smart Search** - Real-time filtering with debounce
- [x] **Print** - نظام PDF مع دعم العربية RTL (Arabic RTL PDF generation)
- [x] **Export Excel** - تصدير البيانات (SpreadsheetML format with Arabic headers)
- [x] **Export CSV** - تصدير CSV (UTF-8 BOM for Arabic support)
- [x] **Bulk Selection** - تحديد الكل (Select all with visual feedback)
- [x] **Toast Notifications** - إشعارات فورية (Real-time action feedback)
- [x] **Framer Motion Animations** - Smooth micro-interactions

### Quality & GRC

- [x] GRC Dashboard with Risk Matrix
- [x] Quality Manual with 9 ISO sections
- [x] Compliance Tracker
- [x] NCR Management

### Medical & Care

- [x] Medical Dashboard
- [x] Medication Administration
- [x] Fall Risk Assessment
- [x] Daily Care Forms

### Reports & Analytics

- [x] Executive Dashboard
- [x] Strategic KPIs
- [x] Integrated Reports

---

## 🚀 Demo Walkthrough

### Quick Start

```bash
npm install
npm run dev
```

Open <http://localhost:5173>

### Key Demo Pages

| Route | Feature |
|-------|---------|
| `/beneficiaries-list` | ⭐ Enhanced toolbar with Print/Export |
| `/grc` | Risk management dashboard |
| `/quality/manual` | ISO 9001 quality manual |
| `/dashboard` | Overview dashboard |

### Demo Steps

1. **Navigate to Beneficiaries List**
   - URL: `/beneficiaries-list`
   - Shows 12 sample beneficiaries

2. **Test Toolbar Buttons**
   - Click **تحديد الكل** (Select All) → Shows "145 محدد" badge
   - Click **Excel** → Downloads .xls file
   - Click **CSV** → Downloads .csv file
   - Click **طباعة** (Print) → Opens print dialog

3. **Verify Toast Notifications**
   - Each action shows Arabic toast in bottom-left
   - Auto-dismisses after 3 seconds

---

## 🔧 Tech Stack

- **React 19** + TypeScript
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching
- **Supabase** - Backend
- **Vite** - Build tool

---

## ⚠️ Known Limitations

1. **Path Issue**: `npm run deploy` fails if project is in path with Arabic characters. Use manual git push workaround.

2. **Print Button**: Opens print dialog for PDF saving (browser-native, not direct PDF download).

3. **Demo Data**: Uses sample data; connect Supabase credentials for production.

4. **Search**: Uses local state filtering. `useAdvancedSearch` hook available for advanced filtering.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── beneficiary/     # Beneficiary management
│   ├── quality/         # Quality manual
│   └── ui/              # Reusable UI components
├── hooks/
│   ├── usePrint.ts      # Print functionality
│   ├── useExport.ts     # Excel/CSV export
│   └── useAdvancedSearch.ts
├── modules/
│   ├── grc/             # GRC dashboard
│   └── catering/        # Food services
└── pages/               # Route pages
```

---

## 🌐 Deployment

**GitHub Pages**: <https://ahmad44ahmad.github.io/Beneficiary-System-Clean-Backup>

```bash
npm run build
npm run deploy
```

---

## 📄 License

Ministry of Human Resources and Social Development (HRSD) - Al-Baha Region
