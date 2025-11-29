import * as React from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => (
    <div className="search-container">
        <input
            type="text"
            className="search-input"
            placeholder="ابحث بالاسم أو رقم المستفيد..."
            value={searchTerm}
            onChange={onSearchChange}
            aria-label="بحث عن مستفيد"
        />
    </div>
);
