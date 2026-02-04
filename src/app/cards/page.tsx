// app/cards/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useCardsStore } from "@/lib/useCardsStore";

function downloadTextFile(filename: string, text: string) {
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export default function CardsPage() {
    const {
        cards,
        topics,
        hydrated,
        addCard,
        deleteCard,
        exportJson,
        mergeImportJson,
    } = useCardsStore();

    const [topic, setTopic] = useState("");
    const [q, setQ] = useState("");
    const [one, setOne] = useState("");
    const [note, setNote] = useState("");

    const [keyword, setKeyword] = useState("");
    const [topicFilter, setTopicFilter] = useState("");
    const [levelFilter, setLevelFilter] = useState<"" | "0" | "1" | "2">("");

    const filtered = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        return cards.filter(c => {
            if (topicFilter && c.topic !== topicFilter) return false;
            if (levelFilter && String(c.level) !== levelFilter) return false;
            if (!kw) return true;
            return (
                c.topic.toLowerCase().includes(kw) ||
                c.question.toLowerCase().includes(kw) ||
                c.oneLiner.toLowerCase().includes(kw) ||
                (c.note ?? "").toLowerCase().includes(kw)
            );
        });
    }, [cards, keyword, topicFilter, levelFilter]);

    if (!hydrated) {
        return <main style={{ padding: 16 }}>Loading…</main>;
    }

    return (
        <main className="container">
            <div className="topbar">
                <div>
                    <h1>Cards</h1>
                    <div className="kicker">Create • Search • Import/Export</div>
                </div>
            </div>

            <section className="panel stack">
                <h2>Add a card</h2>

                <div className="grid-2">
                    <input placeholder="Topic (e.g. React State)" value={topic} onChange={e => setTopic(e.target.value)} />
                    <input placeholder="Question" value={q} onChange={e => setQ(e.target.value)} />
                </div>

                <input placeholder="One-liner (English)" value={one} onChange={e => setOne(e.target.value)} />
                <textarea placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} rows={3} />

                <div className="row">
                    <button className="w-auto" onClick={() => {
                        if (!topic.trim() || !q.trim() || !one.trim()) return;
                        addCard({ topic, question: q, oneLiner: one, note });
                        setQ(""); setOne(""); setNote("");
                    }}>Add</button>
                    <span className="kicker">Tip: keep it short and speakable.</span>
                </div>
            </section>

            <section className="panel stack" style={{ marginTop: 14 }}>
                <h2>Import / Export</h2>
                <div className="row">
                    <button className="btn-secondary w-auto"
                            onClick={() => {
                        const json = exportJson();
                        const name = `cards_${new Date().toISOString().slice(0, 10)}.json`;
                        downloadTextFile(name, json);
                    }}>Export JSON</button>
                    <label className="row w-auto">
                        <span className="kicker">Import JSON:</span>
                        <input className="w-auto" type="file" accept="application/json"
                               onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const text = await file.text();
                            const res = mergeImportJson(text);
                            alert(`Import result: +${res.imported}, updated ${res.updated}, skipped ${res.skipped}`);
                            e.currentTarget.value = "";
                        }} />
                    </label>
                </div>
            </section>

            <section className="stack" style={{ marginTop: 14 }}>
                <div className="topbar">
                    <div>
                        <h1 style={{ fontSize: 20, margin: 0 }}>List</h1>
                        <div className="kicker">{filtered.length} cards</div>
                    </div>
                    <span className="badge">Storage: <span className="code">localStorage</span></span>
                </div>

                <div className="panel stack">
                    <div className="row">
                        <input className="flex-1" placeholder="Search…" value={keyword} onChange={e => setKeyword(e.target.value)} />

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
                    </div>
                </div>

                <div className="stack">
                    {filtered.map(c => (
                        <div key={c.id} className="card">
                            <div className="meta">
                                <strong>{c.topic}</strong>
                                <span className="badge">level {c.level}</span>
                            </div>

                            <div className="hr" />

                            <div><b>Q:</b> {c.question}</div>
                            <div style={{ marginTop: 6 }}><b>1-liner:</b> {c.oneLiner}</div>
                            {c.note ? <div style={{ marginTop: 6 }}><b>Note:</b> {c.note}</div> : null}

                            <div className="row" style={{ marginTop: 10 }}>
                                <button className="btn-danger w-auto" onClick={() => deleteCard(c.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
