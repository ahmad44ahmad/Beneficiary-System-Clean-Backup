import { FixedAsset, MaintenanceTicket } from '../types/assets';

export const mockAssets: FixedAsset[] = [
    {
        id: 'ast_001',
        assetTag: 'MED-2023-001',
        name: 'Electric Wheelchair - Heavy Duty',
        category: 'medical_device',
        location: 'Room 101',
        custody: 'Nurse Station A',
        condition: 'good',
        purchaseDate: '2023-01-15',
        value: 15000,
        lastMaintenanceDate: '2023-06-01'
    },
    {
        id: 'ast_002',
        assetTag: 'FUR-2022-045',
        name: 'Medical Bed - Adjustable',
        category: 'furniture',
        location: 'Room 102',
        custody: 'Nurse Station A',
        condition: 'damaged', // Trigger for maintenance
        purchaseDate: '2022-05-20',
        value: 5000,
        lastMaintenanceDate: '2022-11-10'
    },
    {
        id: 'ast_003',
        assetTag: 'VEH-2021-003',
        name: 'Toyota HiAce Van (Ambulance)',
        category: 'vehicle',
        location: 'Parking Lot B',
        custody: 'Driver Mohammed',
        condition: 'fair',
        purchaseDate: '2021-03-10',
        value: 120000,
        lastMaintenanceDate: '2023-09-01'
    },
    {
        id: 'ast_004',
        assetTag: 'ELE-2023-012',
        name: 'Desktop Computer - Admin',
        category: 'electronic',
        location: 'Director Office',
        custody: 'Admin Assistant',
        condition: 'new',
        purchaseDate: '2023-08-01',
        value: 3500
    },
    {
        id: 'ast_005',
        assetTag: 'APP-2020-088',
        name: 'Industrial Washing Machine',
        category: 'appliance',
        location: 'Laundry Room',
        custody: 'Laundry Supervisor',
        condition: 'good',
        purchaseDate: '2020-02-15',
        value: 8000,
        lastMaintenanceDate: '2023-05-20'
    }
];

export const mockTickets: MaintenanceTicket[] = [
    {
        id: 'tkt_101',
        assetId: 'ast_002',
        assetName: 'Medical Bed - Adjustable',
        reportedBy: 'Nurse Sara',
        reportedAt: '2023-10-25T09:00:00',
        issueDescription: 'Hydraulic lift stuck, not raising.',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'Tech Khalid'
    },
    {
        id: 'tkt_102',
        assetId: 'ast_005',
        assetName: 'Industrial Washing Machine',
        reportedBy: 'Laundry Staff',
        reportedAt: '2023-10-26T14:30:00',
        issueDescription: 'Loud noise during spin cycle.',
        priority: 'medium',
        status: 'open'
    }
];
