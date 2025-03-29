import { assert } from "tsafe/assert";
import type { Skill } from "./skill";

export type ArmorKind = "head" | "chest" | "arms" | "waist" | "legs" | "charm";
export const armorKinds: ArmorKind[] = ["head", "chest", "arms", "waist", "legs", "charm"];

export interface RawArmorPiece {
    name: string;
    description: string;
    id: number;
    kind: ArmorKind;
    skills: {
        id: number;
        level: number;
    }[];
    slots: number[];
}

export interface ArmorPiece {
    name: string;
    description: string;
    id: number;
    kind: ArmorKind;
    skills: Skill[];
    slots: number[];
}

export type Projection<T, Prefix extends string = ""> = {
    [K in keyof T & string as T[K] extends (infer U)[]
        ? U extends object
            ? never
            : `${Prefix}${K}`
        : T[K] extends object
          ? never
          : `${Prefix}${K}`]: boolean;
} & {
    [K in keyof T & string as T[K] extends (infer U)[]
        ? U extends object
            ? keyof Projection<U, `${Prefix}${K}.`>
            : never
        : T[K] extends object
          ? keyof Projection<T[K], `${Prefix}${K}.`>
          : never]: boolean;
};

export const armorProjection: Projection<RawArmorPiece> = {
    name: true,
    description: true,
    id: true,
    kind: true,
    "skills.id": true,
    "skills.level": true,
    slots: true,
};

interface Charm {
    id: number;
    ranks: CharmRank[];
}

interface CharmRank {
    level: number;
    name: string;
    description: string;
    skills: {
        id: number;
        level: number;
    }[];
}

const charmProjection: Projection<Charm> = {
    id: true,
    "ranks.level": true,
    "ranks.name": true,
    "ranks.description": true,
    "ranks.skills.id": true,
    "ranks.skills.level": true,
};

export async function getArmors(skills: Map<number, Skill>): Promise<Map<number, ArmorPiece>> {
    const pieces = async () => {
        const url = new URL("https://wilds.mhdb.io/en/armor");
        url.searchParams.set("p", JSON.stringify(armorProjection));
        url.searchParams.set(
            "q",
            JSON.stringify({
                rank: "high",
            }),
        );
        const resp = await fetch(url);
        return (await resp.json()) as RawArmorPiece[];
    };

    const charms = async () => {
        const url = new URL("https://wilds.mhdb.io/en/charms");
        url.searchParams.set("p", JSON.stringify(charmProjection));
        const resp = await fetch(url);
        return (await resp.json()) as Charm[];
    };

    const [piecesRes, charmsRes] = await Promise.all([pieces(), charms()]);

    const allRawPieces = piecesRes.concat(
        charmsRes.map((charm) => {
            const highestRank = charm.ranks.sort((a, b) => b.level - a.level)[0];
            assert(highestRank !== undefined);

            return {
                name: highestRank.name,
                description: highestRank.description,
                id: charm.id,
                kind: "charm",
                skills: highestRank.skills,
                slots: [],
            };
        }),
    );

    const allPieces = allRawPieces.map((piece) => {
        const res: ArmorPiece = {
            ...piece,
            skills: piece.skills.map((skill) => {
                const skillInstance = skills.get(skill.id);
                assert(skillInstance);
                return skillInstance;
            }),
        };
        return res;
    });

    return new Map(allPieces.map(piece => [piece.id, piece]));
}
