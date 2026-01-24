import React from 'react';
import { ClothingItemEntry } from '../../types';

interface ClothingItemTableProps {
    items: ClothingItemEntry[];
    onChange: (items: ClothingItemEntry[]) => void;
    columns: {
        key: keyof ClothingItemEntry;
        label: string;
        type?: 'text' | 'number';
        width?: string;
    }[];
}

export const ClothingItemTable: React.FC<ClothingItemTableProps> = ({ items, onChange, columns }) => {
    const handleAddRow = () => {
        onChange([...items, { itemId: '', quantity: 1 }]);
    };

    const handleChange = (index: number, field: keyof ClothingItemEntry, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    const handleRemove = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="clothing-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map(col => <th key={col.key} style={{ width: col.width }}>{col.label}</th>)}
                        <th style={{ width: '50px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            {columns.map(col => (
                                <td key={col.key}>
                                    <input
                                        className="table-input"
                                        type={col.type || 'text'}
                                        value={(item as any)[col.key] || ''}
                                        onChange={e => handleChange(index, col.key, e.target.value)}
                                    />
                                </td>
                            ))}
                            <td>
                                <button type="button" onClick={() => handleRemove(index)} className="btn-icon delete" title="حذف">×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" onClick={handleAddRow} className="btn-secondary small" style={{ marginTop: '10px' }}>+ إضافة صنف</button>
        </div>
    );
};
