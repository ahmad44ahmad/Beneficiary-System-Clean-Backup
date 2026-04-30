import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useViewModeStore, isAggregatePersona } from '../stores/useViewModeStore';

/**
 * usePersonaRouting — keeps the active route consistent with the
 * current persona's scope.
 *
 * Aggregate personas (Wakeel, Branch GM) belong on the aggregate
 * dashboard. If the current pathname is anything else, redirect them
 * there. This makes the persona switcher in the header act as a "view
 * the application as X" affordance: switching to Wakeel immediately
 * lands you on the leadership view, never on a beneficiary record.
 *
 * Operational personas (Department Head, Staff) are NOT redirected away
 * from /aggregate — they may peek at the leadership view if they
 * choose. The constraint is one-directional, by design: aggregate
 * personas should not even pass through operational routes.
 *
 * Mounted from MainLayout, so it only runs inside the authenticated
 * shell. Pre-auth routes (/login, /, /system-entry) are never affected.
 */
export const usePersonaRouting = (): void => {
    const persona = useViewModeStore(s => s.currentView);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAggregatePersona(persona)) return;
        if (location.pathname.startsWith('/aggregate')) return;
        navigate('/aggregate', { replace: true });
    }, [persona, location.pathname, navigate]);
};
