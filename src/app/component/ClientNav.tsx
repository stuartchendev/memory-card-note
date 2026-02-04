// components/ClientNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Item = {
    href: string;
    label: string;
    exact?: boolean; // home 用 exact
};

const ITEMS: Item[] = [
    { href: "/", label: "Home", exact: true },
    { href: "/cards", label: "Cards" },
    { href: "/review", label: "Review" },
];

export default function ClientNav() {
    const pathname = usePathname();

    return (
        <nav className="nav-right">
            {ITEMS.map((it) => {
                const active = it.exact
                    ? pathname === it.href
                    : pathname === it.href || pathname.startsWith(it.href + "/");

                return (
                    <NavLink key={it.href} href={it.href} active={active}>
                        {it.label}
                    </NavLink>
                );
            })}
        </nav>
    );
}

function NavLink({
                     href,
                     active,
                     children,
                 }: {
    href: string;
    active: boolean;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`nav-link ${active ? "nav-link-active" : ""}`}
            aria-current={active ? "page" : undefined}
        >
            {children}
        </Link>
    );
}
