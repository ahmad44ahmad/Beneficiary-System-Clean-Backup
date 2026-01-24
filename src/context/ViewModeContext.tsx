import React, { createContext, useContext, useState, ReactNode } from 'react';

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

    return (
        <ViewModeContext.Provider value={{ currentView, setView }}>
            {children}
        </ViewModeContext.Provider>
    );
};

export const useViewMode = () => useContext(ViewModeContext);
