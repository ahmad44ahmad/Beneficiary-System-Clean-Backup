/**
 * Aggregate components — Phase 2.5 substrate.
 *
 * The component family rendered to aggregate-scope personas (Wakeel,
 * Branch GM). They show counts, classifications, and KPIs — never
 * individual beneficiary records, never staff names, never operational
 * detail. Per Ahmad's directive: "محور الخدمة هو المستفيد، ليس
 * الموظف". Aggregate views serve oversight, not surveillance.
 *
 * Each component is read-only by design. There are no onClick handlers
 * that navigate to beneficiary detail pages. If a future requirement
 * surfaces a need for drill-in, it should be a separate operational
 * dashboard accessed by an operational persona, not a property of
 * these components.
 */

export { AggregateKPI } from './AggregateKPI';
export type { AggregateBreakdownRow } from './AggregateKPI';
export { SroiHeadline } from './SroiHeadline';
export { StaffingOverview } from './StaffingOverview';
export type { RoleCount } from './StaffingOverview';
export { ContractorsList } from './ContractorsList';
export type { ContractorRow, ContractStatus } from './ContractorsList';
export { BuildingInfo } from './BuildingInfo';
export type { BuildingInfoData } from './BuildingInfo';
export { RiskRegisterPreview } from './RiskRegisterPreview';
export type { RiskPreviewRow, RiskSeverity } from './RiskRegisterPreview';
