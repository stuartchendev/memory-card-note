// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <header className="nav">
            <div className="nav-inner">
                <div className="nav-left">
                    <Link href="/" className="nav-logo">
                        Memory Cards
                    </Link>
                </div>

                <nav className="nav-right">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/cards">Cards</NavLink>
                    <NavLink href="/review">Review</NavLink>
                </nav>
            </div>
        </header>

        <main>{children}</main>
        </body>
        </html>
    );
}

function NavLink({
                     href,
                     children,
                 }: {
    href: string;
    children: ReactNode;
}) {
    // 用 client-only 的 pathname 判斷 active
    // layout 是 Server Component，但 Link 本身 OK
    return (
        <Link href={href} className="nav-link">
            {children}
        </Link>
    );
}
