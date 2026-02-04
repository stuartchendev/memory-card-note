// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import ClientNav from "@/app/component/ClientNav";

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

                <ClientNav />
            </div>
        </header>

        <main>{children}</main>
        </body>
        </html>
    );
}
