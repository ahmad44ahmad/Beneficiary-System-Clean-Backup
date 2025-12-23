import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, InventoryItem, ClothingRequest } from '../../types';

interface ClothingRequestFormProps {
    beneficiary: Beneficiary;
    inventory: InventoryItem[];
    onSave: (request: ClothingRequest) => void;
    onCancel: () => void;
}

export const ClothingRequestForm: React.FC<ClothingRequestFormProps> = ({ beneficiary, inventory, onSave, onCancel }) => {
    const [type, setType] = useState<'summer' | 'winter' | 'eid' | 'other'>('summer');
    const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantity: number }[]>([]);
    const [receiverName, setReceiverName] = useState('');

    const handleAddItem = (itemId: string) => {
        const existing = selectedItems.find(i => i.itemId === itemId);
        if (existing) {
            setSelectedItems(selectedItems.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setSelectedItems([...selectedItems, { itemId, quantity: 1 }]);
        }
    };

    const handleRemoveItem = (itemId: string) => {
        setSelectedItems(selectedItems.filter(i => i.itemId !== itemId));
    };

    const handleQuantityChange = (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        setSelectedItems(selectedItems.map(i => i.itemId === itemId ? { ...i, quantity } : i));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const request: ClothingRequest = {
            id: `req_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            type,
            requestDate: new Date().toISOString().split('T')[0],
            items: selectedItems,
            receiverName,
            status: 'approved', // Auto-approve for now
            signature: 'signed_placeholder'
        };
        onSave(request);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>صرف كسوة للمستفيد: {beneficiary.fullName}</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>نوع الكسوة</label>
                            <select value={type} onChange={e => setType(e.target.value as any)}>
                                <option value="summer">كسوة صيفية</option>
                                <option value="winter">كسوة شتوية</option>
                                <option value="eid">كسوة عيد</option>
                                <option value="other">أخرى</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>الأصناف المتاحة</label>
                            <div className="inventory-selection-grid">
                                {inventory.filter(i => i.category === 'clothing').map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="inventory-select-btn"
                                        onClick={() => handleAddItem(item.id)}
                                        disabled={item.quantity === 0}
                                    >
                                        {item.name} ({item.size}) - متبقي: {item.quantity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>الأصناف المختارة</label>
                            {selectedItems.length > 0 ? (
                                <ul className="selected-items-list">
                                    {selectedItems.map(item => {
                                        const invItem = inventory.find(i => i.id === item.itemId);
                                        return (
                                            <li key={item.itemId}>
                                                <span>{invItem?.name} ({invItem?.size})</span>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => handleQuantityChange(item.itemId, parseInt(e.target.value))}
                                                    min="1"
                                                    max={invItem?.quantity}
                                                />
                                                <button type="button" onClick={() => handleRemoveItem(item.itemId)}>&times;</button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-muted">لم يتم اختيار أصناف بعد.</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>اسم المستلم</label>
                            <input type="text" value={receiverName} onChange={e => setReceiverName(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>التوقيع</label>
                            <div className="signature-placeholder">
                                (مساحة التوقيع الإلكتروني)
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary" disabled={selectedItems.length === 0}>تأكيد الصرف</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
