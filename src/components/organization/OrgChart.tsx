import React from 'react';
import { OrgNode, CENTER_STRUCTURE } from '../../data/organization';
import { Network, Users, Stethoscope, Calculator, HeartHandshake, ShieldCheck, FileText, Settings, Activity } from 'lucide-react';

// Helper to get icon based on ID/Label
const getIcon = (id: string) => {
    if (id.includes('medical')) return <Stethoscope className="w-5 h-5" />;
    if (id.includes('finance')) return <Calculator className="w-5 h-5" />;
    if (id.includes('social')) return <HeartHandshake className="w-5 h-5" />;
    if (id.includes('support')) return <ShieldCheck className="w-5 h-5" />;
    if (id.includes('quality')) return <Activity className="w-5 h-5" />;
    if (id.includes('secretariat')) return <FileText className="w-5 h-5" />;
    if (id.includes('it')) return <Network className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
};

const OrgNodeCard: React.FC<{ node: OrgNode; level: number }> = ({ node, level }) => {
    // Styles based on level
    const isManager = level === 0;
    const isDept = level === 1;

    // Node Color Classes
    let bgClass = "bg-white";
    let borderClass = "border-gray-200";
    let textClass = "text-gray-800";

    if (isManager) {
        bgClass = "bg-[#1B4D3E] text-white"; // Royal Green
        borderClass = "border-[#d4af37]"; // Gold
    } else if (isDept) {
        bgClass = "bg-[#f0f5f3]";
        borderClass = "border-[#1B4D3E]";
        textClass = "text-[#1B4D3E]";
    }

    return (
        <div className="flex flex-col items-center">
            <div className={`
                relative z-10 flex flex-col items-center justify-center 
                p-4 rounded-xl border-2 shadow-sm transition-all hover:shadow-md cursor-pointer
                ${bgClass} ${borderClass} ${textClass}
                ${isManager ? 'w-64 h-24' : isDept ? 'w-48 h-20' : 'w-40 h-16 text-sm'}
            `}>
                <div className="mb-1 opacity-80">{getIcon(node.id)}</div>
                <span className="font-bold text-center leading-tight">{node.label}</span>
            </div>

            {/* Render Children */}
            {node.children && node.children.length > 0 && (
                <div className="flex flex-col items-center">
                    {/* Vertical Line from Parent to Children Container */}
                    <div className="w-0.5 h-8 bg-gray-300"></div>

                    {/* Horizontal Bar for Children */}
                    <div className="relative flex justify-center gap-8 pt-8 border-t-2 border-gray-300">
                        {/* Adjust horizontal line to not overflow first/last child */}
                        {/* We use negative margins or pseudo elements usually, but flex gap works for simple trees */}

                        {node.children.map((child, idx) => (
                            <div key={child.id} className="relative flex flex-col items-center">
                                {/* Vertical Line from Horizontal Bar to Child */}
                                <div className="absolute -top-8 w-0.5 h-8 bg-gray-300 left-1/2 -translate-x-1/2"></div>

                                <OrgNodeCard node={child} level={level + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const OrgChart: React.FC = () => {
    return (
        <div className="p-8 overflow-x-auto min-h-[600px] flex justify-center items-start bg-slate-50 rounded-3xl">
            <OrgNodeCard node={CENTER_STRUCTURE} level={0} />
        </div>
    );
};
