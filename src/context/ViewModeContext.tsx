import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type ViewMode = 'ADMIN' | 'DIRECTOR' | 'DEPARTMENT_HEAD' | 'STAFF';

interface ViewModeContextType {
    currentView: ViewMode;
    setView: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
    currentView: 'ADMIN',
    setView: () => { }
});

export const ViewModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentView, setView] = useState<ViewMode>('ADMIN');

    const value = useMemo(() => ({ currentView, setView }), [currentView]);

    return (
        <ViewModeContext.Provider value={value}>
            {children}
        </ViewModeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useViewMode = () => useContext(ViewModeContext);
