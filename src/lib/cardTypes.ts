// lib/cardTypes.ts
export type CardLevel = 0 | 1 | 2; // 0=Again, 1=Not sure, 2=I know

export type Card = {
    id: string;
    createdAt: number;
    updatedAt: number;

    topic: string;
    question: string;
    oneLiner: string;
    note?: string;

    level: CardLevel;
    tags: string[];
};

export type CardExportV1 = {
    version: "cards-v1";
    exportedAt: number;
    cards: Card[];
};
