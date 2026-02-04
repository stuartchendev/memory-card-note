// app/review/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useCardsStore } from "@/lib/useCardsStore";
import { pickRandom } from "@/lib/random";
import type { CardLevel } from "@/lib/cardTypes";

export default function ReviewPage() {
    const { cards, topics, hydrated, setCardLevel } = useCardsStore();

    const [topicFilter, setTopicFilter] = useState("");
    const [levelFilter, setLevelFilter] = useState<"" | "0" | "1" | "2">("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const pool = useMemo(() => {
        return cards.filter(c => {
            if (topicFilter && c.topic !== topicFilter) return false;
            if (levelFilter && String(c.level) !== levelFilter) return false;
            return true;
        });
    }, [cards, topicFilter, levelFilter]);

    const activeCard = useMemo(() => {
        if (!activeId) return null;
        return cards.find(c => c.id === activeId) ?? null;
    }, [activeId, cards]);

    function nextCard() {
        const next = pickRandom(pool);
        setActiveId(next?.id ?? null);
        setShowAnswer(false);
    }

    function rate(level: CardLevel) {
        if (!activeCard) return;
        setCardLevel(activeCard.id, level);
        nextCard();
    }

    if (!hydrated) {
        return <main style={{ padding: 16 }}>Loading…</main>;
    }

    return (
        <main className="container">
            <div className="topbar">
                <div>
                    <h1>Review</h1>
                    <div className="kicker">Random cards • Rate your confidence</div>
                </div>
                <span className="badge">Pool <b>{pool.length}</b></span>
            </div>

            <section className="panel stack">
                <h2>Filters</h2>
                <div className="row">
                    <select className="w-auto" value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
                        <option value="">All topics</option>
                        {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <select className="w-auto" value={levelFilter} onChange={e => setLevelFilter(e.target.value as any)}>
                        <option value="">All levels</option>
                        <option value="0">0 - Again</option>
                        <option value="1">1 - Not sure</option>
                        <option value="2">2 - I know</option>
                    </select>

                    <button className="btn-secondary w-auto" onClick={nextCard} disabled={!pool.length}>
                        Start / Next
                    </button>
                </div>
            </section>

            <section className="panel stack" style={{ marginTop: 14 }}>
                <h2>Card</h2>

                {!activeCard ? (
                    <div className="answerHidden">No active card. Click “Start / Next”.</div>
                ) : (
                    <div className="reviewBox stack">
                        <div className="meta">
                            <strong>{activeCard.topic}</strong>
                            <span className="badge">level {activeCard.level}</span>
                        </div>

                        <div><b>Q:</b> {activeCard.question}</div>

                        {showAnswer ? (
                            <div className="stack">
                                <div><b>A (one-liner):</b> {activeCard.oneLiner}</div>
                                {activeCard.note ? <div><b>Note:</b> {activeCard.note}</div> : null}
                            </div>
                        ) : (
                            <div className="answerHidden">Answer hidden</div>
                        )}

                        <div className="row">
                            <button className="btn-secondary w-auto" onClick={() => setShowAnswer(v => !v)}>
                                {showAnswer ? "Hide" : "Show"} Answer
                            </button>

                            <button className="w-auto" onClick={() => rate(2)} disabled={!showAnswer}>I know</button>
                            <button className="w-auto" onClick={() => rate(1)} disabled={!showAnswer}>Not sure</button>
                            <button className="w-auto" onClick={() => rate(0)} disabled={!showAnswer}>Again</button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
