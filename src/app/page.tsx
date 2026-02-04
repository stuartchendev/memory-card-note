// app/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCardsStore } from "@/lib/useCardsStore";

export default function HomePage() {
    const { cards, hydrated } = useCardsStore();

    const stats = useMemo(() => {
        const total = cards.length;
        const lv0 = cards.filter(c => c.level === 0).length;
        const lv1 = cards.filter(c => c.level === 1).length;
        const lv2 = cards.filter(c => c.level === 2).length;
        return { total, lv0, lv1, lv2 };
    }, [cards]);

    if (!hydrated) {
        return <main className="container">Loading…</main>;
    }

    return (
        <main className="container">
            <div className="topbar">
                <div>
                    <h1>Memory Cards</h1>
                    <div className="kicker">Tiny flashcards for interview-ready one-liners.</div>
                </div>
                <span className="badge">
          Total <b style={{ marginLeft: 6 }}>{stats.total}</b>
        </span>
            </div>

            <section className="panel stack">
                <h2>Today</h2>

                <div className="row">
                    <span className="badge">Again <b style={{ marginLeft: 6 }}>{stats.lv0}</b></span>
                    <span className="badge">Not sure <b style={{ marginLeft: 6 }}>{stats.lv1}</b></span>
                    <span className="badge">I know <b style={{ marginLeft: 6 }}>{stats.lv2}</b></span>
                </div>

                <div className="grid-2" style={{ marginTop: 6 }}>
                    <Link href="/cards" className="panel" style={{ display: "block" }}>
                        <div className="stack" style={{ gap: 8 }}>
                            <div className="meta">
                                <strong style={{ fontSize: 16 }}>Manage Cards</strong>
                                <span className="badge">/cards</span>
                            </div>
                            <div className="kicker">
                                Add • Search • Import/Export
                            </div>
                            <div className="row" style={{ marginTop: 6 }}>
                                <button className="w-auto">Go</button>
                                <span className="kicker">Build your daily card set.</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/review" className="panel" style={{ display: "block" }}>
                        <div className="stack" style={{ gap: 8 }}>
                            <div className="meta">
                                <strong style={{ fontSize: 16 }}>Review Mode</strong>
                                <span className="badge">/review</span>
                            </div>
                            <div className="kicker">
                                Random • Show answer • Rate confidence
                            </div>
                            <div className="row" style={{ marginTop: 6 }}>
                                <button className="w-auto">Start</button>
                                <span className="kicker">Warm up before interviews.</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            <section className="stack" style={{ marginTop: 14 }}>
                <div className="panel">
                    <div className="meta">
            <span className="kicker">
              Tip: create at least <span className="code">1 card/day</span>. Don’t backfill.
            </span>
                        <span className="badge">v1 local-only</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
