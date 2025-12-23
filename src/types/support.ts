// Maintenance Types (Extending/Alternative to MaintenanceTicket in assets.ts if needed, 
// but let's conform to the existing MaintenanceTicket structure or map it)
// Checking assets.ts, it has MaintenanceTicket. 
// However, the dashboard might need a broader "MaintenanceRequest" that isn't always linked to a specific fixed asset (e.g. "Leak in ceiling").
// For now, let's keep MaintenanceRequest but rename fields if they conflict, or better yet, link them.

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type MaintenanceType = 'plumbing' | 'electrical' | 'carpentry' | 'ac' | 'cleaning' | 'medical_equipment' | 'other';

export interface MaintenanceRequest {
    id: string;
    description: string;
    location: string; // e.g., "Room 101", "Kitchen"
    type: MaintenanceType;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    requestedBy: string; // Staff name
    requestDate: string;
    completionDate?: string;
    assignedTo?: string; // Technician name
    notes?: string;
    images?: string[]; // URLs
}

// Custody & Asset Types - Reusing/Extending from 'assets.ts' where possible
import { AssetCategory, AssetCondition } from './assets';

export interface AssetItem {
    id: string;
    name: string;
    sku: string; // Barcode/Serial
    category: AssetCategory;
    state: AssetCondition;
    location: string; // Where it is stored
    purchaseDate?: string;
    warrantyExpiry?: string;
    value?: number;
    notes?: string;
    image?: string;
}

export interface CustodyRecord {
    id: string;
    assetId: string;
    assetName: string; // Denormalized for display
    assignedTo: string; // Staff or Beneficiary Name
    type: 'personal' | 'departmental'; // Is it assigned to a person or a department?
    assignDate: string;
    returnDate?: string;
    status: 'active' | 'returned' | 'lost';
    notes?: string;
}

// Mock Data
export const MOCK_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
    {
        id: 'mr1',
        description: 'تسرب مياه في دورة مياه الجناح أ',
        location: 'الجناح أ - دورة المياه 2',
        type: 'plumbing',
        priority: 'high',
        status: 'pending',
        requestedBy: 'محمد القرني',
        requestDate: '2025-12-19',
    },
    {
        id: 'mr2',
        description: 'تعطل مكيف الغرفة 105',
        location: 'غرفة 105',
        type: 'ac',
        priority: 'critical',
        status: 'in_progress',
        requestedBy: 'سعيد العمري',
        requestDate: '2025-12-18',
        assignedTo: 'شركة الصيانة',
    }
];

export const MOCK_ASSETS: AssetItem[] = [
    {
        id: 'a1',
        name: 'جهاز لابتوب HP',
        sku: 'IT-2025-001',
        category: 'electronic',
        state: 'good',
        location: 'مكتب الإدارة',
        purchaseDate: '2024-01-15'
    },
    {
        id: 'a2',
        name: 'كرسي متحرك كهربائي',
        sku: 'MED-2024-055',
        category: 'medical_device',
        state: 'fair',
        location: 'المستودع الرئيسي',
        purchaseDate: '2023-06-20'
    }
];

export const MOCK_CUSTODY: CustodyRecord[] = [
    {
        id: 'c1',
        assetId: 'a1',
        assetName: 'جهاز لابتوب HP',
        assignedTo: 'أحمد الشهري',
        type: 'personal',
        assignDate: '2025-01-01',
        status: 'active'
    }
];
