import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function SidebarItem({ item, isCollapsed }) {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    // Check if any submenu is active to auto-expand
    const isSubmenuActive = hasSubmenu && item.submenu.some(sub => sub.active);
    const [isOpen, setIsOpen] = useState(isSubmenuActive);

    const toggleOpen = (e) => {
        if (hasSubmenu) {
            e.preventDefault();
            if (!isCollapsed) setIsOpen(!isOpen);
        }
    };

    const baseClass = `flex items-center relative px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${isCollapsed ? 'justify-center' : 'justify-between'}`;
    const activeClass = item.active || isSubmenuActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100';

    const renderContent = () => (
        <>
            <div className="flex items-center gap-3.5">
                <Icon size={22} className={`transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${item.active || isSubmenuActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} strokeWidth={item.active || isSubmenuActive ? 2.5 : 2} />
                {!isCollapsed && (
                    <span className="whitespace-nowrap">{item.name}</span>
                )}
            </div>

            {/* Badges / Chevrons (only visible if not collapsed) */}
            {!isCollapsed && (
                <div className="flex items-center gap-2">
                    {item.badge && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                            {item.badge}
                        </span>
                    )}
                    {hasSubmenu && (
                        isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                </div>
            )}

            {/* Badge dot for collapsed mode */}
            {isCollapsed && item.badge && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-slate-950 rounded-full"></span>
            )}
        </>
    );

    return (
        <div className="space-y-1">
            {hasSubmenu ? (
                <button
                    onClick={toggleOpen}
                    className={`${baseClass} ${activeClass} w-full text-left`}
                    title={isCollapsed ? item.name : undefined}
                >
                    {renderContent()}
                </button>
            ) : (
                <Link
                    href={item.href}
                    className={`${baseClass} ${activeClass}`}
                    title={isCollapsed ? item.name : undefined}
                >
                    {renderContent()}
                </Link>
            )}

            {/* Submenu Dropdown */}
            {hasSubmenu && !isCollapsed && isOpen && (
                <div className="pl-11 pr-2 pt-1 pb-2 space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-200">
                    {item.submenu.map((sub, idx) => (
                        <Link
                            key={idx}
                            href={sub.href}
                            className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${sub.active ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            {sub.name}
                            {sub.badge && (
                                <span className="ml-2 inline-block bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {sub.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
