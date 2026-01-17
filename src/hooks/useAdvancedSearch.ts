// ═══════════════════════════════════════════════════════════════════════════
// Advanced Search Hook for Basira System
// Provides debounced search with filter support
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useMemo, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type FilterOperator =
    | 'equals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'between'
    | 'in';

export interface SearchFilter {
    field: string;
    operator: FilterOperator;
    value: any;
    label?: string; // Arabic label for display
}

export interface SearchConfig {
    searchFields: string[]; // Fields to search in
    debounceMs?: number;
    caseSensitive?: boolean;
}

export interface UseSearchResult<T> {
    query: string;
    setQuery: (query: string) => void;
    filters: SearchFilter[];
    addFilter: (filter: SearchFilter) => void;
    removeFilter: (field: string) => void;
    clearFilters: () => void;
    results: T[];
    isSearching: boolean;
    resultCount: number;
    hasActiveFilters: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Advanced search hook with filtering capabilities
 * 
 * @example
 * ```tsx
 * const { query, setQuery, filters, results } = useAdvancedSearch(
 *   beneficiaries,
 *   { searchFields: ['fullName', 'nationalId'] }
 * );
 * ```
 */
export function useAdvancedSearch<T extends Record<string, any>>(
    data: T[],
    config: SearchConfig
): UseSearchResult<T> {
    const {
        searchFields,
        debounceMs = 300,
        caseSensitive = false
    } = config;

    const [query, setQueryRaw] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilter[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounce search query
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setIsSearching(false);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs]);

    // Set query wrapper
    const setQuery = useCallback((newQuery: string) => {
        setQueryRaw(newQuery);
    }, []);

    // Filter management
    const addFilter = useCallback((filter: SearchFilter) => {
        setFilters(prev => {
            // Replace existing filter for same field
            const filtered = prev.filter(f => f.field !== filter.field);
            return [...filtered, filter];
        });
    }, []);

    const removeFilter = useCallback((field: string) => {
        setFilters(prev => prev.filter(f => f.field !== field));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters([]);
        setQueryRaw('');
    }, []);

    // Apply search and filters
    const results = useMemo(() => {
        let filtered = [...data];

        // Apply text search
        if (debouncedQuery.trim()) {
            const searchTerm = caseSensitive
                ? debouncedQuery.trim()
                : debouncedQuery.trim().toLowerCase();

            filtered = filtered.filter(item => {
                return searchFields.some(field => {
                    const value = getNestedValue(item, field);
                    if (value == null) return false;

                    const strValue = caseSensitive
                        ? String(value)
                        : String(value).toLowerCase();

                    return strValue.includes(searchTerm);
                });
            });
        }

        // Apply filters
        filters.forEach(filter => {
            filtered = filtered.filter(item => {
                const value = getNestedValue(item, filter.field);
                return matchesFilter(value, filter);
            });
        });

        return filtered;
    }, [data, debouncedQuery, filters, searchFields, caseSensitive]);

    return {
        query,
        setQuery,
        filters,
        addFilter,
        removeFilter,
        clearFilters,
        results,
        isSearching,
        resultCount: results.length,
        hasActiveFilters: filters.length > 0 || query.trim().length > 0,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get nested object value using dot notation
 */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
        return current?.[key];
    }, obj);
}

/**
 * Check if a value matches a filter
 */
function matchesFilter(value: any, filter: SearchFilter): boolean {
    const { operator, value: filterValue } = filter;

    if (value == null) return false;

    switch (operator) {
        case 'equals':
            return value === filterValue;

        case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());

        case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());

        case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());

        case 'gt':
            return Number(value) > Number(filterValue);

        case 'gte':
            return Number(value) >= Number(filterValue);

        case 'lt':
            return Number(value) < Number(filterValue);

        case 'lte':
            return Number(value) <= Number(filterValue);

        case 'between':
            if (Array.isArray(filterValue) && filterValue.length === 2) {
                const numValue = Number(value);
                return numValue >= Number(filterValue[0]) && numValue <= Number(filterValue[1]);
            }
            return false;

        case 'in':
            if (Array.isArray(filterValue)) {
                return filterValue.includes(value);
            }
            return false;

        default:
            return true;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Saved Searches
// ═══════════════════════════════════════════════════════════════════════════

const SAVED_SEARCHES_KEY = 'basira_saved_searches';

export interface SavedSearch {
    id: string;
    name: string;
    query: string;
    filters: SearchFilter[];
    module: string;
    createdAt: string;
}

/**
 * Save a search configuration
 */
export function saveSearch(name: string, query: string, filters: SearchFilter[], module: string): void {
    const saved = getSavedSearches();
    const newSearch: SavedSearch = {
        id: `search_${Date.now()}`,
        name,
        query,
        filters,
        module,
        createdAt: new Date().toISOString(),
    };
    saved.push(newSearch);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(saved));
}

/**
 * Get all saved searches
 */
export function getSavedSearches(): SavedSearch[] {
    try {
        return JSON.parse(localStorage.getItem(SAVED_SEARCHES_KEY) || '[]');
    } catch {
        return [];
    }
}

/**
 * Delete a saved search
 */
export function deleteSavedSearch(id: string): void {
    const saved = getSavedSearches().filter(s => s.id !== id);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(saved));
}

/**
 * Get saved searches for a specific module
 */
export function getModuleSavedSearches(module: string): SavedSearch[] {
    return getSavedSearches().filter(s => s.module === module);
}

export default useAdvancedSearch;
