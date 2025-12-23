import { InventoryItem } from '../types';

export const inventoryItems: InventoryItem[] = [
    { id: 'inv_1', name: 'ثوب صيفي', size: 'M', quantity: 50, category: 'clothing', minQuantity: 10, lastUpdated: '2023-10-01' },
    { id: 'inv_2', name: 'ثوب شتوي', size: 'L', quantity: 30, category: 'clothing', minQuantity: 10, lastUpdated: '2023-10-01' },
    { id: 'inv_3', name: 'بجامة نوم', size: 'M', quantity: 100, category: 'clothing', minQuantity: 20, lastUpdated: '2023-10-01' },
    { id: 'inv_4', name: 'حذاء رياضي', size: '42', quantity: 20, category: 'clothing', minQuantity: 5, lastUpdated: '2023-10-01' },
    { id: 'inv_5', name: 'شامبو', size: '500ml', quantity: 200, category: 'hygiene', minQuantity: 50, lastUpdated: '2023-10-01' },
    { id: 'inv_6', name: 'صابون', size: '100g', quantity: 300, category: 'hygiene', minQuantity: 50, lastUpdated: '2023-10-01' },
];
