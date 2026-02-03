# 🚀 Basira 5.0 Upgrade Roadmap

## Feature 1: Dignity Profile (Ehsan Algorithm) ✅

**Goal**: Digitizing beneficiary preferences for personalized care.

- [x] Create SQL Migration Script (`scripts/feature_1_dignity_profile.sql`)
- [x] Update TypeScript Definitions (`types/index.ts`, `types/dignity-profile.ts`)
- [x] Create Dignity Profile Form (`DignityProfileForm.tsx`)
- [x] Enhance Dignity Profile Card (`DignityProfileCard.tsx`)
- [x] Implement Backend Logic (`supaService.ts`)
- [x] Wire up to Beneficiary Detail Panel

## Feature 2: SROI Dashboard ✅

**Goal**: Visualizing Social Return on Investment.

- [x] Create SQL Migration for SROI Metrics
- [x] Create `SroiDashboard` Component with Charts (Recharts)
- [x] Implement Calculator Logic
- [x] Add Export to PDF/Excel

## Feature 3: Predictive Risk Engine ✅

**Goal**: AI-driven risk analysis.

- [x] Create `RiskAnalysisService` (Simulation)
- [x] Build `RiskPredictionCard` Component
- [x] Integrate with Fall Risk Assessments

## Feature 4: Golden Thread Governance (الحوكمة - الخيط الذهبي) ✅

**Goal**: Linking strategic goals to individual outcomes.

- [x] Create Governance Data Model
- [x] Build `GoldenThreadView` Component
- [x] Link IEP/Rehab Plans to Strategic Goals (Visual only for now)

  - [x] Feature 5: Just Culture & OVR <!-- id: 7 -->
    - [x] Create `OvrReportForm` (Wizard) <!-- id: 7a -->
    - [x] Create `QualityDashboard` for Quality Team <!-- id: 7b -->
    - [x] Implement Anonymous Reporting Logic <!-- id: 7c -->

# Phase 2: Future Quality Enhancements 🚀

## Feature 6: "Smart Sense" (IoT Vitals) ✅

**Goal**: Real-time health tracking to detect deterioration.

- [x] Create `iotService.ts` (Mock WebSockets)
- [x] Build `VitalsMonitorCard` Component
- [x] Integrate into `MedicalDashboard`

## Feature 7: "Family Connect 2.0" ✅

**Goal**: Rich media engagement for families.

- [x] Create `FamilyMediaFeed` Component
- [x] Update `FamilyPortal`

## Feature 8: "Opti-Staff" (AI Staffing) ✅

**Goal**: Acuity-based staff allocation.

- [x] Create `StaffingOptimizer` Service
- [x] Build `ShiftRecommendation` View

---

## Prior Completed Tasks (Legacy)

- [x] Data Import & Validation
- [x] Alert Tags System
- [x] Basic UI Refactoring
