'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    CalendarDays,
    Settings,
} from 'lucide-react';
import { SIDEBAR_LABELS } from '@/constants/ui-text';


type NavItem = {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    disabled?: boolean;
};

type SidebarSection = {
    label: string;
    items: NavItem[];
};

// Deduplicated sidebar items for display
const SIDEBAR_SECTIONS: SidebarSection[] = [
    {
        label: '메인',
        items: [
            { href: '/', label: SIDEBAR_LABELS.dashboard, icon: LayoutDashboard },
            { href: '/agents', label: SIDEBAR_LABELS.agents, icon: Users },
        ],
    },
    {
        label: '업무',
        items: [
            { href: '/chat', label: SIDEBAR_LABELS.chat, icon: MessageSquare, disabled: true },
            { href: '/meetings', label: SIDEBAR_LABELS.calendar, icon: CalendarDays },
        ],
    },
    {
        label: '설정',
        items: [
            { href: '/settings', label: SIDEBAR_LABELS.system, icon: Settings, disabled: true },
        ],
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    const isActive = (href: string, disabled?: boolean) => {
        if (disabled) return false;
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <h1>Yootopia</h1>
                <p>AI Agent Meeting System</p>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {SIDEBAR_SECTIONS.map((section) => (
                    <div key={section.label} style={{ marginBottom: '8px' }}>
                        <div className="sidebar-section-label">{section.label}</div>
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href, item.disabled);
                            if (item.disabled) {
                                return (
                                    <div
                                        key={item.label}
                                        className="sidebar-item"
                                        style={{ opacity: 0.35, cursor: 'not-allowed' }}
                                    >
                                        <Icon className="icon" size={16} />
                                        {item.label}
                                    </div>
                                );
                            }
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`sidebar-item ${active ? 'active' : ''}`}
                                >
                                    <Icon className="icon" size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-item" style={{ opacity: 0.5, cursor: 'default', fontSize: '11px' }}>
                    <span>⚡</span>
                    <span>Zooffice v0.1</span>
                </div>
            </div>
        </aside>
    );
}
