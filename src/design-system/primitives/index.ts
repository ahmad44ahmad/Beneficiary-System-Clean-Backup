/**
 * Design system primitives — Phase 2.5 substrate.
 *
 * These four primitives cover the bulk of layout needs in carry-over
 * surfaces (BeneficiaryDetail, ExecutiveReport, LegalShield, ...). They
 * consume the brand level + tokens directly so consuming components do
 * not need to know which palette is active.
 *
 * Import as:
 *   import { Section, PageHeader, EmptyState, DescriptionList } from '@/design-system/primitives';
 */

export { Section } from './Section';
export { PageHeader } from './PageHeader';
export { EmptyState } from './EmptyState';
export { DescriptionList } from './DescriptionList';
export type { DescriptionItem } from './DescriptionList';
