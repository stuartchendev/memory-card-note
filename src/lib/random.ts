// lib/random.ts
export function uid(prefix = "c") {
    // good-enough id for local-only MVP
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function pickRandom<T>(arr: T[]): T | null {
    if (!arr.length) return null;
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx] ?? null;
}
