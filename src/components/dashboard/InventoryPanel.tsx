import * as React from 'react';
import { InventoryItem } from '../../types';

interface InventoryPanelProps {
    inventory: InventoryItem[];
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory }) => {
    return (
        <div className="inventory-panel">
            <h2>إدارة المخزون والكسوة</h2>
            <div className="inventory-grid">
                {inventory.map(item => (
                    <div key={item.id} className="inventory-card">
                        <div className="inventory-icon">
                            {item.category === 'clothing' && '👕'}
                            {item.category === 'hygiene' && '🧼'}
                            {item.category === 'other' && '📦'}
                        </div>
                        <div className="inventory-details">
                            <h4>{item.name}</h4>
                            <p><strong>المقاس:</strong> {item.size}</p>
                            <p><strong>الكمية:</strong> <span className={item.quantity < 10 ? 'low-stock' : ''}>{item.quantity}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
