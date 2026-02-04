// lib/useCardsStore.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Card, CardExportV1, CardLevel } from "./cardTypes";
import { loadCardsFromStorage, saveCardsToStorage } from "./storage";
import { uid } from "./random";

type ImportResult = {
    imported: number;
    updated: number;
    skipped: number;
};

function keyOf(card: Card) {
    // for merge: same topic = same cards
    // could change to id merge
    return `${card.topic.trim().toLowerCase()}::${card.question.trim().toLowerCase()}`;
}

function normalizeIncomingCard(x: any): Card | null {
    if (!x || typeof x !== "object") return null;
    if (typeof x.topic !== "string" || typeof x.question !== "string" || typeof x.oneLiner !== "string") return null;

    const now = Date.now();
    const level: CardLevel = x.level === 1 || x.level === 2 ? x.level : 0;

    return {
        id: typeof x.id === "string" ? x.id : uid("c"),
        createdAt: typeof x.createdAt === "number" ? x.createdAt : now,
        updatedAt: typeof x.updatedAt === "number" ? x.updatedAt : now,
        topic: x.topic.trim(),
        question: x.question.trim(),
        oneLiner: x.oneLiner.trim(),
        note: typeof x.note === "string" ? x.note : "",
        level,
        tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
    };
}

export function useCardsStore() {
    const [cards, setCards] = useState<Card[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // hydrate once
    useEffect(() => {
        const loaded = loadCardsFromStorage();
        setCards(loaded);
        setHydrated(true);
    }, []);

    // persist on change (after hydrate)
    useEffect(() => {
        if (!hydrated) return;
        saveCardsToStorage(cards);
    }, [cards, hydrated]);

    const topics = useMemo(() => {
        const s = new Set<string>();
        for (const c of cards) s.add(c.topic);
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [cards]);

    function addCard(input: Pick<Card, "topic" | "question" | "oneLiner" | "note"> & Partial<Pick<Card, "tags" | "level">>) {
        const now = Date.now();
        const card: Card = {
            id: uid("c"),
            createdAt: now,
            updatedAt: now,
            topic: input.topic.trim(),
            question: input.question.trim(),
            oneLiner: input.oneLiner.trim(),
            note: (input.note ?? "").trim(),
            level: input.level ?? 0,
            tags: input.tags ?? [],
        };
        setCards(prev => [card, ...prev]);
        return card.id;
    }

    function deleteCard(id: string) {
        setCards(prev => prev.filter(c => c.id !== id));
    }

    function updateCard(id: string, patch: Partial<Omit<Card, "id" | "createdAt">>) {
        const now = Date.now();
        setCards(prev =>
            prev.map(c => {
                if (c.id !== id) return c;
                return {
                    ...c,
                    ...patch,
                    updatedAt: now,
                    topic: patch.topic !== undefined ? String(patch.topic).trim() : c.topic,
                    question: patch.question !== undefined ? String(patch.question).trim() : c.question,
                    oneLiner: patch.oneLiner !== undefined ? String(patch.oneLiner).trim() : c.oneLiner,
                    note: patch.note !== undefined ? String(patch.note).trim() : c.note,
                    tags: patch.tags !== undefined ? patch.tags.map(String) : c.tags,
                    level: patch.level !== undefined ? (patch.level as CardLevel) : c.level,
                };
            })
        );
    }

    function setCardLevel(id: string, level: CardLevel) {
        updateCard(id, { level });
    }

    function exportJson(): string {
        const payload: CardExportV1 = {
            version: "cards-v1",
            exportedAt: Date.now(),
            cards,
        };
        return JSON.stringify(payload, null, 2);
    }

    function mergeImportJson(jsonText: string): ImportResult {
        let parsed: any;
        try {
            parsed = JSON.parse(jsonText);
        } catch {
            return { imported: 0, updated: 0, skipped: 0 };
        }

        const incomingRaw = Array.isArray(parsed) ? parsed : parsed?.cards;
        if (!Array.isArray(incomingRaw)) return { imported: 0, updated: 0, skipped: 0 };

        const incoming = incomingRaw
            .map(normalizeIncomingCard)
            .filter((x): x is Card => Boolean(x));

        if (!incoming.length) return { imported: 0, updated: 0, skipped: 0 };

        let imported = 0, updated = 0, skipped = 0;

        setCards(prev => {
            const byKey = new Map<string, Card>();
            const byId = new Map<string, Card>();

            for (const c of prev) {
                byKey.set(keyOf(c), c);
                byId.set(c.id, c);
            }

            const next = [...prev];

            for (const inc of incoming) {
                // merge 優先：id 命中 → key 命中 → new
                const existingById = byId.get(inc.id);
                const existingByKey = byKey.get(keyOf(inc));

                const existing = existingById ?? existingByKey;

                if (!existing) {
                    next.unshift({ ...inc, updatedAt: Date.now() });
                    imported++;
                    continue;
                }

                // 如果 incoming 比 existing 更新，就更新（最小規則）
                const incIsNewer = inc.updatedAt >= existing.updatedAt;
                if (!incIsNewer) {
                    skipped++;
                    continue;
                }

                const merged: Card = {
                    ...existing,
                    ...inc,
                    id: existing.id, // 保留既有 id（避免列表跳動）
                    createdAt: existing.createdAt,
                    updatedAt: Date.now(),
                };

                const idx = next.findIndex(c => c.id === existing.id);
                if (idx >= 0) next[idx] = merged;
                updated++;
            }

            return next;
        });

        return { imported, updated, skipped };
    }

    return {
        cards,
        hydrated,
        topics,
        addCard,
        deleteCard,
        updateCard,
        setCardLevel,
        exportJson,
        mergeImportJson,
    };
}
