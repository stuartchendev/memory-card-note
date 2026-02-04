// lib/storage.ts
import type { Card } from "./cardTypes";

const STORAGE_KEY = "cards:v1";

export function loadCardsFromStorage(): Card[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isCardLike).map(normalizeCard);
    } catch {
        return [];
    }
}

export function saveCardsToStorage(cards: Card[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function isCardLike(x: any): boolean {
    return (
        x &&
        typeof x === "object" &&
        typeof x.id === "string" &&
        typeof x.topic === "string" &&
        typeof x.question === "string" &&
        typeof x.oneLiner === "string"
    );
}

function normalizeCard(x: any): Card {
    const now = Date.now();
    const level: 0 | 1 | 2 = x.level === 1 || x.level === 2 ? x.level : 0;
    return {
        id: x.id,
        createdAt: typeof x.createdAt === "number" ? x.createdAt : now,
        updatedAt: typeof x.updatedAt === "number" ? x.updatedAt : now,
        topic: String(x.topic ?? ""),
        question: String(x.question ?? ""),
        oneLiner: String(x.oneLiner ?? ""),
        note: x.note ? String(x.note) : "",
        level,
        tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
    };
}
