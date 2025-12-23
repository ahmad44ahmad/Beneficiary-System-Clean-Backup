export type AssetCategory = 'medical_device' | 'furniture' | 'vehicle' | 'electronic' | 'appliance' | 'other';
export type AssetCondition = 'new' | 'good' | 'fair' | 'poor' | 'damaged' | 'retired';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved';

export interface FixedAsset {
    id: string;
    assetTag: string; // Barcode
    name: string;
    category: AssetCategory;
    location: string; // Room Number or Department
    custody: string; // Employee Name
    condition: AssetCondition;
    purchaseDate: string;
    value: number; // Financial Value
    lastMaintenanceDate?: string;
    notes?: string;
}

export interface MaintenanceTicket {
    id: string;
    assetId: string;
    assetName: string; // Denormalized for display convenience
    reportedBy: string;
    reportedAt: string; // ISO Date
    issueDescription: string;
    priority: TicketPriority;
    status: TicketStatus;
    assignedTo?: string; // Technician Name
    resolvedAt?: string;
    resolutionNotes?: string;
}
