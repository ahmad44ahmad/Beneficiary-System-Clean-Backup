// src/components/navigation/index.ts
// Navigation components barrel export

export { Breadcrumb } from './Breadcrumb';
// Note: QuickActions functionality is provided by CommandMenu in ../ui/CommandMenu.tsx
// Re-export for API consistency with the improvement plan
export { CommandMenu as QuickActions } from '../ui/CommandMenu';
